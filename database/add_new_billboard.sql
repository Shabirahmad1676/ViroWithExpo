-- ============================================
-- TEMPLATE: ADD NEW BILLBOARD WITH IMAGE
-- ============================================

INSERT INTO billboards (
  -- Required Fields
  marker_id,        -- Unique ID for the marker (e.g., 'newStore')
  title,            -- Title shown on map/list
  business,         -- Business Name
  image_url,        -- DIRECT link to image (must be https://...)
  
  -- Location (Syncs to Map)
  latitude,         -- e.g. 34.2000
  longitude,        -- e.g. 72.0400
  location,         -- Text description like "City Center"
  
  -- Details
  description,
  full_description,
  category,         -- Food & Beverage, Fashion, etc.
  city,             -- Default 'Mardan'
  is_active,        -- Must be true to show on map
  is_trending
) 
VALUES (
  'myNewBillboard_01',                  -- <--- CHANGE THIS (Must be unique)
  'New Tech Store Opening',             -- <--- CHANGE THIS
  'TechZone Mardan',                    -- <--- CHANGE THIS
  'https://images.unsplash.com/photo-1593642532400-2682810df593', -- <--- CHANGE THIS (Laptop image example)
  
  34.2050,                              -- <--- CHANGE Latitude
  72.0450,                              -- <--- CHANGE Longitude
  'Bank Road, Mardan',
  
  'Best laptops and accessories in town.',
  'Visit TechZone for the latest gadgets, laptops, and mobile accessories. Grand opening sale this weekend!',
  'Electronics',
  'Mardan',
  true,                                 -- Active = shows on map automatically
  true                                  -- Trending = shows in trending list
);

-- NOTE: You do NOT need to insert into 'billboarddataformap'. 
-- The automation we added earlier will detect this new row 
-- and automatically sync it to the map!
