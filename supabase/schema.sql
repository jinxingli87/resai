-- Run this in the Supabase SQL editor

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  total_cents integer not null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  customer_email text not null,
  customer_name text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- Order items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null default 1,
  price_cents integer not null
);

-- Row Level Security
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Orders: users can view their own orders
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders"
  on orders for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Service role can insert/update orders (used by webhook)
create policy "Service role full access to orders"
  on orders for all
  using (auth.role() = 'service_role');

-- Order items: users can view their own
create policy "Users can view own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- Service role can insert order items
create policy "Service role full access to order items"
  on order_items for all
  using (auth.role() = 'service_role');

-- Admins can view all order items
create policy "Admins can view all order items"
  on order_items for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- To make yourself admin (run once with your user ID):
-- update profiles set is_admin = true where email = 'your@email.com';
