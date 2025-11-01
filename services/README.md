# API Service - Centralized Database Calls

This directory contains centralized API services for all Supabase database operations. Use these services instead of calling Supabase directly in components.

## 📁 File Structure

- `apiService.js` - Main API service with all database functions

## 🚀 Usage

### Import the service functions

```jsx
import { getTrendingBillboards, getBillboardById } from '../services/apiService'
```

### Example Usage

```jsx
import { useState, useEffect } from 'react'
import { getTrendingBillboards } from '../services/apiService'

function MyComponent() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    const { data, error } = await getTrendingBillboards('Mardan')
    
    if (error) {
      console.error('Error:', error)
    } else {
      setAds(data)
    }
    
    setLoading(false)
  }
}
```

## 📚 Available Functions

### Billboards

- `getTrendingBillboards(city)` - Get trending billboards for a city
- `getAllBillboards(city)` - Get all active billboards
- `getBillboardById(id)` - Get billboard by UUID
- `getBillboardByMarkerId(markerId)` - Get billboard by marker ID (for AR)
- `incrementBillboardViews(id)` - Increment view count

### Map Data

- `getMapBillboards(city)` - Get billboard data optimized for map display

### Interests

- `getAllInterests()` - Get all available interest categories
- `getUserInterests(userId)` - Get user's selected interests
- `saveUserInterests(userId, interests)` - Save/update user interests

### Favorites

- `getUserFavorites(userId)` - Get user's favorite billboards
- `checkIfFavorite(userId, markerId)` - Check if billboard is favorited
- `addToFavorites(userId, billboardId, markerId)` - Add to favorites
- `removeFromFavorites(userId, billboardId)` - Remove from favorites

### Profile

- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, profileData)` - Update user profile

### Search

- `searchBillboards(keyword, city)` - Search billboards by keyword
- `getBillboardsByCategory(category, city)` - Get billboards by category

## 🔄 Return Format

All functions return an object with this structure:

```javascript
{
  data: // Success data or null
  error: // Error object or null
}
```

## ✅ Benefits

1. **Centralized Logic**: All database calls in one place
2. **Consistent Error Handling**: Standardized error management
3. **Easy Testing**: Mock services easily
4. **Reusability**: Use same functions across components
5. **Maintainability**: Update logic in one place

## 🔧 Best Practices

1. Always handle errors:
   ```jsx
   const { data, error } = await getTrendingBillboards()
   if (error) {
     // Handle error
   }
   ```

2. Use loading states:
   ```jsx
   const [loading, setLoading] = useState(true)
   // ... fetch data
   setLoading(false)
   ```

3. Check for data before using:
   ```jsx
   if (data && data.length > 0) {
     // Use data
   }
   ```

## 📝 Notes

- All functions are async and return Promises
- Functions handle their own error logging
- Data is returned as-is from Supabase (you may need to format)
- City parameter defaults to 'Mardan' if not provided

