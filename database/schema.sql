-- ============================================
-- VTour Database Schema for Supabase
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Execute section by section or all at once
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Extended user profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. INTERESTS TABLE
-- ============================================
-- Predefined interest categories
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read interests
CREATE POLICY "Interests are viewable by everyone"
  ON interests FOR SELECT
  USING (true);

-- Insert default interests
INSERT INTO interests (name, icon) VALUES
  ('Food & Beverage', '🍔'),
  ('Fashion & Sports', '👕'),
  ('Electronics', '📱'),
  ('Beauty & Health', '💄'),
  ('Travel & Tourism', '✈️'),
  ('Entertainment', '🎬'),
  ('Automotive', '🚗'),
  ('Real Estate', '🏠'),
  ('Education', '📚'),
  ('Fitness & Gym', '💪')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 3. USER_INTERESTS TABLE
-- ============================================
-- Stores user's selected interests
CREATE TABLE IF NOT EXISTS user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own interests
CREATE POLICY "Users can view own interests"
  ON user_interests FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own interests
CREATE POLICY "Users can insert own interests"
  ON user_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own interests
CREATE POLICY "Users can update own interests"
  ON user_interests FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own interests
CREATE POLICY "Users can delete own interests"
  ON user_interests FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. BILLBOARDS TABLE
-- ============================================
-- Main billboard/advertisement table
CREATE TABLE IF NOT EXISTS billboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marker_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  business TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  location TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  views INTEGER DEFAULT 0,
  discount TEXT,
  contact TEXT,
  phone_no TEXT,
  web_url TEXT,
  hours TEXT,
  features TEXT[] DEFAULT '{}',
  is_trending BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  city TEXT DEFAULT 'Mardan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_billboards_city ON billboards(city);
CREATE INDEX IF NOT EXISTS idx_billboards_trending ON billboards(is_trending);
CREATE INDEX IF NOT EXISTS idx_billboards_active ON billboards(is_active);
CREATE INDEX IF NOT EXISTS idx_billboards_marker ON billboards(marker_id);

-- Enable Row Level Security
ALTER TABLE billboards ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active billboards
CREATE POLICY "Active billboards are viewable by everyone"
  ON billboards FOR SELECT
  USING (is_active = true);

-- Policy: Everyone can update views count (for tracking)
CREATE POLICY "Anyone can increment views"
  ON billboards FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can insert billboards (optional - remove if only admins should)
-- CREATE POLICY "Authenticated users can insert billboards"
--   ON billboards FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 5. BILLBOARDDATAFORMAP TABLE
-- ============================================
-- Optimized data for map display
CREATE TABLE IF NOT EXISTS billboarddataformap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billboard_id UUID REFERENCES billboards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  coords DECIMAL[] NOT NULL, -- [longitude, latitude]
  image_url TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster map queries
CREATE INDEX IF NOT EXISTS idx_map_billboard_id ON billboarddataformap(billboard_id);

-- Enable Row Level Security
ALTER TABLE billboarddataformap ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read map data
CREATE POLICY "Map data is viewable by everyone"
  ON billboarddataformap FOR SELECT
  USING (true);

-- ============================================
-- 6. FAVORITES TABLE
-- ============================================
-- User's favorite billboards
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  billboard_id UUID REFERENCES billboards(id) ON DELETE CASCADE,
  marker_id TEXT REFERENCES billboards(marker_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, billboard_id),
  UNIQUE(user_id, marker_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_billboard ON favorites(billboard_id);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_interests
CREATE TRIGGER update_user_interests_updated_at
  BEFORE UPDATE ON user_interests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to billboards
CREATE TRIGGER update_billboards_updated_at
  BEFORE UPDATE ON billboards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to billboarddataformap
CREATE TRIGGER update_map_data_updated_at
  BEFORE UPDATE ON billboarddataformap
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. FUNCTION: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. SAMPLE DATA FOR MARDA   
-- ============================================
-- Insert sample billboards for Mardan (adjust coordinates as needed)
INSERT INTO billboards (
  marker_id, title, description, full_description, business, category,
  location, address, latitude, longitude, rating, views, discount,
  contact, phone_no, web_url, hours, features, is_trending, city
) VALUES
(
  'logoMarker',
  'KFC Mardan - New Spicy Wings',
  'Try our new spicy wings with special Mardan sauce. Limited time offer!',
  'Experience the perfect blend of spices in our new spicy wings. Made with locally sourced ingredients and our signature Mardan sauce. This limited-time offer includes free fries and a soft drink with every order. Perfect for family gatherings and casual dining.',
  'KFC Mardan',
  'Food & Beverage',
  'Mardan City Center',
  'Shop #15, Mardan City Center, Main Market Road',
  34.1980, 72.0350,
  4.5,
  2300,
  '20% OFF',
  '+92 300 1234567',
  '923001234567',
  'https://www.kfc.com.pk',
  '10:00 AM - 11:00 PM',
  ARRAY['Free WiFi', 'Parking Available', 'Delivery Service', 'Family Friendly'],
  true,
  'Mardan'
),
(
  'nikeMarker',
  'Nike Store - Sports Collection',
  'Latest sports collection with premium quality. Perfect for athletes!',
  'Discover the latest Nike sports collection featuring premium quality athletic wear and footwear. From running shoes to training gear, we have everything you need to perform at your best. Our collection includes both men''s and women''s apparel with the latest technology and comfort features.',
  'Nike Mardan',
  'Fashion & Sports',
  'Mardan Mall',
  'Level 2, Mardan Mall, GT Road',
  34.2000, 72.0400,
  4.8,
  1800,
  '30% OFF',
  '+92 300 7654321',
  '923007654321',
  'https://www.nike.com',
  '9:00 AM - 10:00 PM',
  ARRAY['Premium Quality', 'Latest Collection', 'Size Exchange', 'Athlete Discount'],
  true,
  'Mardan'
),
(
  'cocaMarker',
  'Coca-Cola Refreshment Zone',
  'Stay refreshed with Coca-Cola. Special deals for Mardan residents!',
  'Quench your thirst with the world''s favorite beverage. Our Coca-Cola Refreshment Zone offers a variety of soft drinks, juices, and snacks. Perfect for travelers and locals alike. Enjoy our special ''Buy 2 Get 1 Free'' offer on all Coca-Cola products.',
  'Coca-Cola Mardan',
  'Beverages',
  'Mardan Highway',
  'Mardan Highway, Near Bus Stand',
  34.1950, 72.0300,
  4.2,
  3100,
  'Buy 2 Get 1 Free',
  '+92 300 9876543',
  '923009876543',
  'https://www.coca-cola.com',
  '8:00 AM - 12:00 AM',
  ARRAY['24/7 Service', 'Drive-Thru', 'Cold Beverages', 'Snacks Available'],
  true,
  'Mardan'
)
ON CONFLICT (marker_id) DO NOTHING;

-- Insert corresponding map data
INSERT INTO billboarddataformap (billboard_id, title, coords, image_url, location)
SELECT 
  b.id,
  b.title,
  ARRAY[b.longitude, b.latitude]::DECIMAL[],
  b.image_url,
  b.location
FROM billboards b
WHERE b.city = 'Mardan'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify tables were created:
-- SELECT * FROM profiles;
-- SELECT * FROM interests;
-- SELECT * FROM user_interests;
-- SELECT * FROM billboards;
-- SELECT * FROM billboarddataformap;
-- SELECT * FROM favorites;

-- ============================================
-- END OF SCHEMA
-- ============================================

