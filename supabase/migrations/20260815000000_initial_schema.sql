-- ============================================================================
-- ccjaouhara — Phase 3 initial schema foundation
--
-- Purpose:
--   Reproducible schema for the durable Supabase persistence of the existing
--   ccjaouhara application. Column names are chosen to match the exact shapes
--   the running application (src/types.ts + serverDB.ts) reads and writes:
--     * products  -> camelCase (serverDB.ts upserts the full Product object)
--     * orders    -> snake_case (the Order type already uses snake_case)
--     * reviews / messages / subscribers -> snake_case (new tables)
--   Access is service-role driven (bypasses RLS); RLS policies below only
--   allow conservative public READS, never public writes.
--
-- NOTE: the application's in-memory shapes for reviews (customerName,
-- createdAt), messages (fullName, createdAt) and subscribers (createdAt) are
-- camelCase. A server-side column-mapping shim is expected in a later step
-- before those tables are wired into serverDB.ts.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PRODUCTS
--    Mirrors the Product type (src/types.ts). Columns match the camelCase keys
--    serverDB.ts persists verbatim via upsert. Array fields (images, tags,
--    secondaryKeywords) are flat string arrays, so they use text[] rather than
--    JSONB; JSONB is reserved for genuinely structured data (orders.items).
-- ----------------------------------------------------------------------------
create table public.products (
  id                  text primary key,
  name                text not null,
  description         text not null,
  price               numeric(10,2) not null default 0 check (price >= 0),
  images              text[] not null default '{}',
  stock               integer not null default 0 check (stock >= 0),
  category            text not null,
  material            text not null,
  color               text not null,
  rating              numeric(3,1) not null default 0 check (rating >= 0 and rating <= 5),
  reviews             integer not null default 0 check (reviews >= 0),
  "seoTitle"          text,
  "metaDescription"   text,
  slug                text,
  "imageAltText"      text,
  tags                text[],
  "primaryKeyword"    text,
  "secondaryKeywords" text[]
);

-- ----------------------------------------------------------------------------
-- 2. ORDERS
--    Mirrors the Order type exactly (src/types.ts): customer fields, embedded
--    items as JSONB (OrderItem[]), monetary fields, optional idempotency_key,
--    status and created_at. A partial unique index enforces idempotency while
--    remaining compatible with the application's optional idempotency_key
--    (NULLs are allowed, only non-NULL values must be unique).
-- ----------------------------------------------------------------------------
create table public.orders (
  id                 text primary key,
  customer_name      text not null,
  customer_phone     text not null,
  customer_email     text not null,
  customer_country   text not null,
  customer_city      text not null,
  customer_street    text not null,
  customer_apartment text,
  payment_method     text not null,
  order_notes        text,
  items              jsonb not null default '[]'::jsonb,
  subtotal           numeric(10,2) not null default 0 check (subtotal >= 0),
  shipping_cost      numeric(10,2) not null default 0 check (shipping_cost >= 0),
  discount_amount    numeric(10,2) not null default 0 check (discount_amount >= 0),
  discount_code      text,
  total              numeric(10,2) not null default 0 check (total >= 0),
  idempotency_key    text,
  status             text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at         timestamptz not null default now()
);

create unique index orders_idempotency_key_unique_idx
  on public.orders (idempotency_key)
  where idempotency_key is not null;

-- ----------------------------------------------------------------------------
-- 3. REVIEWS
--    snake_case columns for the Review domain. The server currently stores
--    reviews only on local disk; a mapping shim will adapt camelCase
--    (customerName/customerEmail/createdAt) to these columns when wired.
-- ----------------------------------------------------------------------------
create table public.reviews (
  id             text primary key,
  product_id     text not null references public.products (id) on delete cascade,
  customer_name  text not null,
  customer_email text,
  rating         integer not null check (rating between 1 and 5),
  comment        text not null,
  created_at     timestamptz not null default now(),
  status         text not null default 'pending'
                 check (status in ('pending', 'approved', 'rejected'))
);

create index reviews_product_id_idx on public.reviews (product_id);

-- ----------------------------------------------------------------------------
-- 4. MESSAGES
--    snake_case columns for the ContactMessage domain. phone and subject are
--    included because the application's ContactMessage type and POST
--    /api/messages handler persist them (they default to '' in the app).
-- ----------------------------------------------------------------------------
create table public.messages (
  id         text primary key,
  full_name  text not null,
  email      text not null,
  phone      text not null default '',
  subject    text not null default '',
  message    text not null,
  created_at timestamptz not null default now(),
  status     text not null default 'new'
             check (status in ('new', 'read'))
);

-- ----------------------------------------------------------------------------
-- 5. SUBSCRIBERS
--    snake_case columns matching the Subscriber type. Case-insensitive email
--    uniqueness mirrors the application's in-process dedupe (lowercased).
-- ----------------------------------------------------------------------------
create table public.subscribers (
  id         text primary key,
  email      text not null,
  created_at timestamptz not null default now(),
  status     text not null default 'active'
             check (status in ('active'))
);

create unique index subscribers_email_lower_unique_idx
  on public.subscribers (lower(email));

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
--   The server authenticates with the service-role key, which bypasses RLS,
--   so no service-role policies are needed. Only conservative READ access is
--   granted to anon/authenticated; there are NO public write policies.
--   orders, messages and subscribers get no anon/authenticated policies,
--   therefore all client access to them is denied (server-only via API).
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.subscribers enable row level security;

grant select on public.products to anon, authenticated;
grant select on public.reviews to anon, authenticated;

-- Public catalog is readable.
create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Public may only read approved reviews.
create policy "reviews_public_approved_read"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'approved');

-- orders / messages / subscribers: intentionally no policies (deny all for
-- anon/authenticated). All access goes through the Express API + service role.

-- ----------------------------------------------------------------------------
-- STORAGE
--   Bucket used by POST /api/upload (server.ts): ccjaouhara-images is public
--   so uploaded images resolve via their public URL. Uploads are performed
--   with the service-role key (bypasses RLS); only public READ is granted to
--   anon/authenticated. No public write.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('ccjaouhara-images', 'ccjaouhara-images', true)
on conflict (id) do nothing;

create policy "storage_ccjaouhara_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'ccjaouhara-images');

-- ----------------------------------------------------------------------------
-- 6. ATOMIC ORDER + STOCK RPC
--    create_order_with_stock(...) replaces the previous read-stock -> decrement
--    -> create-order -> restore sequence with a single PostgreSQL transaction:
--      * idempotency fast check first: an existing non-null idempotency_key
--        returns the stored order without touching stock,
--      * per-item SELECT ... FOR UPDATE row locks serialize concurrent buyers of
--        the same product, so two orders can never sell the same last unit and
--        stock can never go negative (no clamping to zero),
--      * insufficient stock aborts the whole transaction with SQLSTATE 'CC409'
--        (server maps it to HTTP 409); earlier decrements in the same call are
--        rolled back by the PL/pgSQL subtransaction, so no partial decrement,
--      * the order row is inserted ONLY after all stock checks/decrements pass,
--      * idempotency is enforced by the existing partial unique index
--        (orders_idempotency_key_unique_idx). A concurrent duplicate insert
--        raises unique_violation (23505); the subtransaction rolls back this
--        call's stock decrements and the already-existing order is returned.
--    SECURITY INVOKER: this function only ever runs with the service-role key
--    (bypasses RLS). Execute is revoked from public/anon/authenticated.
-- ----------------------------------------------------------------------------
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
  item          jsonb;
  v_product_id  text;
  v_qty         integer;
  v_stock       integer;
  v_order       public.orders;
begin
  begin
    -- 1) Idempotency fast check: reuse the existing order, decrement nothing.
    if p_idempotency_key is not null then
      select * into v_order
      from public.orders
      where idempotency_key = p_idempotency_key;

      if found then
        return v_order;
      end if;
    end if;

    -- 2) Serialize per product: lock the row, validate stock, decrement.
    --    SELECT ... FOR UPDATE blocks concurrent buyers of the same product
    --    until this transaction commits; stock is never clamped and can never
    --    go negative because we abort (CC409) before any shortfall decrement.
    for item in
      select value
      from jsonb_array_elements(p_items)
    loop
      v_product_id := item->>'product_id';
      v_qty        := (item->>'quantity')::integer;

      if v_product_id is null or v_qty is null or v_qty < 1 then
        raise exception 'Invalid item payload'
          using errcode = 'CC400';
      end if;

      select stock into v_stock
      from public.products
      where id = v_product_id
      for update;

      if not found then
        raise exception 'Product not found: %', v_product_id
          using errcode = 'CC404';
      end if;

      if v_stock < v_qty then
        raise exception 'Insufficient stock for product %', v_product_id
          using errcode = 'CC409';
      end if;

      update public.products
      set stock = stock - v_qty
      where id = v_product_id;
    end loop;

    -- 3) Insert the order only after every stock check/decrement succeeded.
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
    -- A concurrent request already committed an order carrying this
    -- idempotency_key. The subtransaction rollback undoes this call's stock
    -- decrements and insert; return the winning order so exactly one order and
    -- one stock decrement ever exist for the key.
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

-- Service-role only: this RPC performs privileged stock + order writes and must
-- not be invocable by anon/authenticated (which, as SECURITY INVOKER, would
-- fail on RLS anyway).
revoke execute on function public.create_order_with_stock(text, text, text, text, text, text, text, text, text, text, jsonb, numeric, numeric, numeric, text, numeric, text, text)
  from public, anon, authenticated;
grant execute on function public.create_order_with_stock(text, text, text, text, text, text, text, text, text, text, jsonb, numeric, numeric, numeric, text, numeric, text, text)
  to service_role;
