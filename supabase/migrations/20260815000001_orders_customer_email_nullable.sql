-- Allow legacy orders without a customer email.
-- The original schema required NOT NULL, but 10 local legacy orders have
-- customer_email = "" which must map to database NULL rather than fail.
-- New orders are still validated server-side; this column remains nullable
-- only to accommodate historical data.

alter table public.orders
  alter column customer_email drop not null;
