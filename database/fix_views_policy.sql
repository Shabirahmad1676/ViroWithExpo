-- Fix for Billboard Views Increment Error
-- Run this in Supabase SQL Editor to fix the "Cannot coerce the result to a single JSON object" error

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can increment views" ON billboards;

-- Create policy to allow updating views count
CREATE POLICY "Anyone can increment views"
  ON billboards FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'billboards';

