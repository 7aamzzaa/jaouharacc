-- ============================================================================
-- Product variants + explicit availability-confirmation workflow.
--
-- This migration is additive and backward compatible:
--   * existing products get variants = [] and inventory_policy = 'tracked',
--     preserving their product-level stock behaviour;
--   * variant products are still ONE row in public.products, with an array of
--     variants and no per-variant stock records;
--   * 'availability_to_confirm' products skip stock checks/decrements. Stock 0
--     means "request only", not an invented quantity and not a production
--     promise. The server keeps an anti-abuse cap of 99 per order line;
--   * orders receive the additive status 'awaiting_availability' so an
--     unreviewed request is never automatically confirmed. Existing statuses
--     remain valid, and the seller can move a request to 'confirmed' or
--     'cancelled' (unavailable) with the existing status API.
--
-- NOT APPLIED as part of this phase. Apply separately with approval.
-- ============================================================================

alter table public.products
  add column if not exists variants jsonb not null default '[]'::jsonb,
  add column if not exists inventory_policy text not null default 'tracked';

-- Normalize a previously prepared, unapplied made-to-order label if present.
update public.products
  set inventory_policy = 'availability_to_confirm'
  where inventory_policy = 'made_to_order';

alter table public.products
  drop constraint if exists products_inventory_policy_check;

alter table public.products
  add constraint products_inventory_policy_check
  check (inventory_policy in ('tracked', 'availability_to_confirm'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_variants_is_array_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_variants_is_array_check
      check (jsonb_typeof(variants) = 'array');
  end if;
end $$;

-- Additive order status: old rows keep their values; new requests are stored
-- as 'awaiting_availability' by the order API until the seller reviews them.
alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'awaiting_availability', 'confirmed', 'shipped', 'delivered', 'cancelled'));

create or replace function public.create_order_with_stock(
  p_id text,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_customer_country text,
  p_customer_city text,
  p_customer_street text,
  p_customer_apartment text,
  p_payment_method text,
  p_order_notes text,
  p_items jsonb,
  p_subtotal numeric(10,2),
  p_shipping_cost numeric(10,2),
  p_discount_amount numeric(10,2),
  p_discount_code text,
  p_total numeric(10,2),
  p_idempotency_key text,
  p_status text
)
returns public.orders
language plpgsql
as $$
declare
  item              jsonb;
  v_product_id      text;
  v_variant_id      text;
  v_qty             integer;
  v_stock           integer;
  v_inventory_policy text;
  v_variants        jsonb;
  v_price           numeric(10,2);
  v_order           public.orders;
begin
  begin
    -- Idempotency fast check: reuse the existing order, decrement nothing.
    if p_idempotency_key is not null then
      select * into v_order
      from public.orders
      where idempotency_key = p_idempotency_key;

      if found then
        return v_order;
      end if;
    end if;

    -- Serialize per product. Tracked products validate/decrement stock;
    -- availability-confirmation requests reserve nothing and are allowed at
    -- stock 0 because no availability has been promised yet.
    for item in
      select value
      from jsonb_array_elements(p_items)
    loop
      v_product_id := item->>'product_id';
      v_variant_id := item->>'variant_id';
      v_qty        := (item->>'quantity')::integer;

      -- Documented anti-abuse limit, not an inventory quantity.
      if v_product_id is null or v_qty is null or v_qty < 1 or v_qty > 99 then
        raise exception 'Invalid item payload'
          using errcode = 'CC400';
      end if;

      select stock, inventory_policy, variants, price
      into v_stock, v_inventory_policy, v_variants, v_price
      from public.products
      where id = v_product_id
      for update;

      if not found then
        raise exception 'Product not found: %', v_product_id
          using errcode = 'CC404';
      end if;

      if v_inventory_policy not in ('tracked', 'availability_to_confirm') then
        raise exception 'Invalid inventory policy for product %', v_product_id
          using errcode = 'CC400';
      end if;

      -- Price and policy are taken from the product row, never from the client.
      if (item->>'price')::numeric is distinct from v_price then
        raise exception 'Price mismatch for product %', v_product_id
          using errcode = 'CC400';
      end if;

      if coalesce((item->>'availability_to_confirm')::boolean, false)
         is distinct from (v_inventory_policy = 'availability_to_confirm') then
        raise exception 'Inventory policy mismatch for product %', v_product_id
          using errcode = 'CC400';
      end if;

      if v_product_id = 'CCJ-NEC-CYGNE'
         and (v_price is distinct from 79
              or v_inventory_policy is distinct from 'availability_to_confirm') then
        raise exception 'Invalid configuration for CCJ-NEC-CYGNE'
          using errcode = 'CC400';
      end if;

      if jsonb_array_length(coalesce(v_variants, '[]'::jsonb)) > 0 then
        if v_variant_id is null or not exists (
          select 1
          from jsonb_array_elements(v_variants) as elem
          where elem.value->>'id' = v_variant_id
        ) then
          raise exception 'Invalid variant for product %', v_product_id
            using errcode = 'CC400';
        end if;
      end if;

      if v_inventory_policy = 'tracked' then
        if v_stock < v_qty then
          raise exception 'Insufficient stock for product %', v_product_id
            using errcode = 'CC409';
        end if;

        update public.products
        set stock = stock - v_qty
        where id = v_product_id;
      end if;
    end loop;

    -- Insert the order only after every stock check/decrement succeeded.
    insert into public.orders (
      id,
      customer_name,
      customer_phone,
      customer_email,
      customer_country,
      customer_city,
      customer_street,
      customer_apartment,
      payment_method,
      order_notes,
      items,
      subtotal,
      shipping_cost,
      discount_amount,
      discount_code,
      total,
      idempotency_key,
      status
    ) values (
      p_id,
      p_customer_name,
      p_customer_phone,
      p_customer_email,
      p_customer_country,
      p_customer_city,
      p_customer_street,
      p_customer_apartment,
      p_payment_method,
      p_order_notes,
      p_items,
      p_subtotal,
      p_shipping_cost,
      p_discount_amount,
      p_discount_code,
      p_total,
      p_idempotency_key,
      coalesce(p_status, 'pending')
    );

    select * into v_order
    from public.orders
    where id = p_id;

    return v_order;

  exception when unique_violation then
    select * into v_order
    from public.orders
    where idempotency_key = p_idempotency_key;

    if found then
      return v_order;
    end if;

    raise;
  end;
end;
$$;

revoke execute on function public.create_order_with_stock(text, text, text, text, text, text, text, text, text, text, jsonb, numeric, numeric, numeric, text, numeric, text, text)
  from public, anon, authenticated;
grant execute on function public.create_order_with_stock(text, text, text, text, text, text, text, text, text, text, jsonb, numeric, numeric, numeric, text, numeric, text, text)
  to service_role;
