# Fix for Billboard Views Increment Error

## Problem
When trying to increment billboard views, you get this error:
```
Error: {"code": "PGRST116", "details": "The result contains 0 rows", "hint": null, "message": "Cannot coerce the result to a single JSON object"}
```

## Root Cause
The `billboards` table has Row Level Security (RLS) enabled, but there was **no UPDATE policy**. This means:
1. Users can SELECT (read) active billboards ✅
2. Users **cannot** UPDATE (modify) any billboards ❌

When the `incrementBillboardViews` function tries to update the views count, Supabase rejects the operation, and `.single()` returns 0 rows, causing the error.

## Solution

### For New Databases
The `schema.sql` file has been updated to include the UPDATE policy. Just run:
```bash
psql -U postgres -d your_database -f database/schema.sql
```

### For Existing Databases
Run the SQL migration in Supabase SQL Editor:

**Option 1: Using the migration file**
```bash
# Copy and paste the contents of database/fix_views_policy.sql into Supabase SQL Editor
```

**Option 2: Run directly in Supabase**
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste and run:

```sql
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can increment views" ON billboards;

-- Create policy to allow updating views count
CREATE POLICY "Anyone can increment views"
  ON billboards FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

**Option 3: Via Supabase CLI**
```bash
supabase db push
```

## Verify Fix
After applying the fix, you can verify with:
```sql
SELECT * FROM pg_policies WHERE tablename = 'billboards';
```

You should see the "Anyone can increment views" policy listed.

## Security Note
The current policy allows **anyone** to update billboards. This is intentional for views tracking, but if you want to restrict it:

```sql
-- Only allow updating views, not other fields
-- This requires a more complex policy using triggers or functions
```

Alternatively, you could restrict to authenticated users only:
```sql
CREATE POLICY "Authenticated users can update views"
  ON billboards FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

## Testing
After applying the fix, test the increment by:
1. Navigate to the home screen with trending billboards
2. Click "View Details" on any billboard
3. Check that no errors appear in the console
4. Verify views count increases in the database

## Related Files
- `services/apiService.js` - Contains `incrementBillboardViews` function
- `app/(tabs)/index.jsx` - Calls increment on view details
- `app/post/[id].jsx` - Calls increment on billboard page load
- `database/schema.sql` - Database schema with RLS policies

