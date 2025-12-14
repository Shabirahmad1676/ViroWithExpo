-- ============================================
-- FIX DATABASE IMAGES, CONSTRAINTS & SYNC (V3)
-- ============================================

-- 0. CRITICAL: DROP EXISTING TRIGGER FIRST 
-- We must remove the old trigger before doing any updates, otherwise 
-- the updates will try to fire the broken trigger and fail!
DROP TRIGGER IF EXISTS trg_sync_billboard_map ON billboards;
DROP FUNCTION IF EXISTS sync_billboard_to_map();

-- 1. PREPARE FOR CONSTRAINTS (Clean Duplicates)
-- We need to remove duplicates before adding a unique constraint
DELETE FROM billboarddataformap a USING billboarddataformap b 
WHERE a.id < b.id AND a.billboard_id = b.billboard_id;

-- 2. ADD UNIQUE CONSTRAINT
-- This is required for the "ON CONFLICT" clause to work later
ALTER TABLE billboarddataformap DROP CONSTRAINT IF EXISTS unique_billboard_id_map;
ALTER TABLE billboarddataformap ADD CONSTRAINT unique_billboard_id_map UNIQUE (billboard_id);

-- 3. FIX INCORRECT IMAGES
-- Now safe to run because the trigger is gone
UPDATE billboards 
SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' 
WHERE marker_id = 'nikeMarker' AND image_url NOT LIKE 'http%';

UPDATE billboards 
SET image_url = 'https://images.unsplash.com/photo-1554866585-cd94860890b7' 
WHERE marker_id = 'cocaMarker'; 

-- Fix KFC (User preferred image)
UPDATE billboards 
SET image_url = 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22' 
WHERE marker_id = 'logoMarker';

-- 4. SYNC MAP DATA manually once
UPDATE billboarddataformap bdm
SET 
  image_url = b.image_url,
  title = b.title,
  location = b.location,
  coords = ARRAY[b.longitude, b.latitude]::DECIMAL[]
FROM billboards b
WHERE bdm.billboard_id = b.id;

-- 5. RE-CREATE AUTOMATION
CREATE OR REPLACE FUNCTION sync_billboard_to_map()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if chart is active
  IF NEW.is_active = true THEN
    -- Update or Insert into map table
    INSERT INTO billboarddataformap (billboard_id, title, coords, image_url, location)
    VALUES (
        NEW.id, 
        NEW.title, 
        ARRAY[NEW.longitude, NEW.latitude]::DECIMAL[], 
        NEW.image_url, 
        NEW.location
    )
    ON CONFLICT (billboard_id) 
    DO UPDATE SET
        title = EXCLUDED.title,
        coords = EXCLUDED.coords,
        image_url = EXCLUDED.image_url,
        location = EXCLUDED.location,
        updated_at = NOW();
  ELSE
    -- If inactive, remove from map
    DELETE FROM billboarddataformap WHERE billboard_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER trg_sync_billboard_map
AFTER INSERT OR UPDATE ON billboards
FOR EACH ROW
EXECUTE FUNCTION sync_billboard_to_map();
