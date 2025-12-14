-- ==========================================
-- 1. SETUP TABLES (Run this once)
-- ==========================================

-- Create Coupons Table (The "Offer")
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  billboard_id uuid references public.billboards(id), -- Nullable for generic coupons
  title text not null,
  description text,
  discount_code text not null, -- The secret code (e.g., "SUMMER50")
  discount_amount text not null, -- e.g. "50% OFF"
  valid_until timestamptz,
  created_at timestamptz default now()
);

-- Create User_Coupons Table (The "Wallet")
create table if not exists public.user_coupons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  coupon_id uuid references public.coupons(id) not null,
  status text default 'active' check (status in ('active', 'redeemed', 'expired')),
  redeemed_at timestamptz,
  created_at timestamptz default now(),
  unique (user_id, coupon_id) -- Prevent duplicate saves
);

-- Enable RLS
alter table public.coupons enable row level security;
alter table public.user_coupons enable row level security;

-- Policies
create policy "Public coupons match" on public.coupons for select using (true);
create policy "Users view own coupons" on public.user_coupons for select using (auth.uid() = user_id);
create policy "Users save coupons" on public.user_coupons for insert with check (auth.uid() = user_id);

-- ==========================================
-- 2. TEST DATA (Run this to verify the App)
-- ==========================================

-- Insert a Fake Coupon
WITH new_coupon AS (
  INSERT INTO public.coupons (title, description, discount_code, discount_amount, valid_until)
  VALUES 
    ('Free Coffee @ Starbucks', 'Get a free Latte on your next visit.', 'FREECOFFEE', '100% OFF', now() + interval '7 days'),
    ('Nike Summer Sale', 'Flat 20% off on all Running Shoes', 'RUN20', '20% OFF', now() + interval '30 days')
  RETURNING id
)
-- Assign it to YOUR user (replace 'YOUR_USER_ID_HERE' with your actual UUID from the users table users > id columns)
-- OR just run this part without the specific user_id if you want to insert globally and claim manually in app (requires more code).
-- EASIER WAY:
-- 1. Run the "SETUP TABLES" part.
-- 2. Go to your App -> Login.
-- 3. Copy your User ID from Supabase Auth Dashboard.
-- 4. Run:
-- INSERT INTO public.user_coupons (user_id, coupon_id) VALUES ('YOUR_PASTED_ID', 'ID_OF_COUPON_CREATED_ABOVE');
SELECT * FROM new_coupon;
