-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create Coupons Table (The "Offer")
create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  billboard_id uuid references public.billboards(id) not null,
  title text not null,
  description text,
  discount_code text not null, -- The secret code the cashier verifies (e.g., "SUMMER50")
  discount_amount text not null, -- e.g. "50% OFF" or "$10"
  valid_until timestamptz,
  created_at timestamptz default now()
);

-- 2. Create User_Coupons Table (The "Wallet")
create table public.user_coupons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  coupon_id uuid references public.coupons(id) not null,
  status text default 'active' check (status in ('active', 'redeemed', 'expired')),
  redeemed_at timestamptz,
  created_at timestamptz default now(),
  unique (user_id, coupon_id) -- Prevent duplicate saves
);

-- 3. Enable RLS
alter table public.coupons enable row level security;
alter table public.user_coupons enable row level security;

-- 4. Policies
-- Anyone can view coupons
create policy "Public coupons are viewable by everyone" 
  on public.coupons for select using (true);

-- Users can view their own saved coupons
create policy "Users can view own coupons" 
  on public.user_coupons for select using (auth.uid() = user_id);

-- Users can insert (save) coupons
create policy "Users can save coupons" 
  on public.user_coupons for insert with check (auth.uid() = user_id);
  
-- 5. Insert Dummy Data (Optional - For Testing)
-- Make sure to replace 'BILLBOARD_UUID_HERE' with a real ID from your billboards table if you run this!
/*
insert into public.coupons (billboard_id, title, description, discount_code, discount_amount)
values 
  ('BILLBOARD_UUID_HERE', 'Free Pizza Slice', 'Get a free slice with any drink purchase', 'PIZZA2025', '100% OFF'),
  ('BILLBOARD_UUID_HERE', 'Summer Sale', 'Flat 20% off on all jeans', 'DENIM20', '20% OFF');
*/
