/**
 * Centralized API Service for VTour App
 * All Supabase database calls are handled here
 * Use this service instead of direct supabase calls in components
 */

import { supabase } from '../utils/supabase';

// ============================================
// BILLBOARDS API
// ============================================

/**
 * Get all trending billboards for a city (default: Mardan)
 * @param {string} city - City name (default: 'Mardan')
 * @returns {Promise<Array>} Array of billboard objects
 */
export const getTrendingBillboards = async (city = 'Mardan') => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('city', city)
      .eq('is_trending', true)
      .eq('is_active', true)
      .order('views', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching trending billboards:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getTrendingBillboards:', error);
    return { data: null, error };
  }
};

/**
 * Get all billboards for a city
 * @param {string} city - City name (default: 'Mardan')
 * @returns {Promise<Array>} Array of billboard objects
 */
export const getAllBillboards = async (city = 'Mardan') => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('city', city)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching billboards:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getAllBillboards:', error);
    return { data: null, error };
  }
};

/**
 * Get billboard by ID
 * @param {string} id - Billboard UUID
 * @returns {Promise<Object>} Billboard object
 */
export const getBillboardById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching billboard by ID:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getBillboardById:', error);
    return { data: null, error };
  }
};

/**
 * Get billboard by marker_id (for AR)
 * @param {string} markerId - Marker ID
 * @returns {Promise<Object>} Billboard object
 */
export const getBillboardByMarkerId = async (markerId) => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('marker_id', markerId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching billboard by marker ID:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getBillboardByMarkerId:', error);
    return { data: null, error };
  }
};

/**
 * Increment views count for a billboard
 * @param {string} id - Billboard UUID
 * @returns {Promise<Object>} Updated billboard
 */
export const incrementBillboardViews = async (id) => {
  try {
    // First get current views
    const { data: current } = await supabase
      .from('billboards')
      .select('views')
      .eq('id', id)
      .single();

    if (!current) {
      throw new Error('Billboard not found');
    }

    // Increment views
    const { data, error } = await supabase
      .from('billboards')
      .update({ views: current.views + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in incrementBillboardViews:', error);
    return { data: null, error };
  }
};

// ============================================
// MAP DATA API
// ============================================

/**
 * Get all billboards data for map display
 * @param {string} city - City name (default: 'Mardan')
 * @returns {Promise<Array>} Array of map billboard objects
 */
export const getMapBillboards = async (city = 'Mardan') => {
  try {
    // Fetch from billboarddataformap table
    const { data: mapData, error: mapError } = await supabase
      .from('billboarddataformap')
      .select('*')
      .order('created_at', { ascending: false });

    if (mapError) {
      console.error('Error fetching map billboards:', mapError);
      throw mapError;
    }

    // Transform data to expected format
    const transformedData = mapData?.map(item => ({
      id: item.id || item.billboard_id,
      billboard_id: item.billboard_id,
      title: item.title,
      coords: item.coords, // Already in [longitude, latitude] format
      image_url: item.image_url,
      location: item.location,
    })) || [];

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error in getMapBillboards:', error);
    return { data: null, error };
  }
};

// ============================================
// INTERESTS API
// ============================================

/**
 * Get all available interests
 * @returns {Promise<Array>} Array of interest objects
 */
export const getAllInterests = async () => {
  try {
    const { data, error } = await supabase
      .from('interests')
      .select('name, icon')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching interests:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getAllInterests:', error);
    return { data: null, error };
  }
};

/**
 * Get user's selected interests
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} User interests object
 */
export const getUserInterests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_interests')
      .select('interests')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user interests:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserInterests:', error);
    return { data: null, error };
  }
};

/**
 * Save or update user interests
 * @param {string} userId - User UUID
 * @param {Array<string>} interests - Array of interest names
 * @returns {Promise<Object>} Updated user interests
 */
export const saveUserInterests = async (userId, interests) => {
  try {
    // Check if user already has interests
    const { data: existing } = await supabase
      .from('user_interests')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('user_interests')
        .update({ 
          interests,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      result = { data, error };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('user_interests')
        .insert([{ user_id: userId, interests }])
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Error saving user interests:', result.error);
      throw result.error;
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error in saveUserInterests:', error);
    return { data: null, error };
  }
};

// ============================================
// FAVORITES API
// ============================================

/**
 * Get user's favorite billboards
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of favorite billboard objects
 */
export const getUserFavorites = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        billboards (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    return { data: null, error };
  }
};

/**
 * Check if a billboard is saved in favorites
 * @param {string} userId - User UUID
 * @param {string} markerId - Marker ID or billboard ID
 * @returns {Promise<boolean>} True if favorited
 */
export const checkIfFavorite = async (userId, markerId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .or(`marker_id.eq.${markerId},billboard_id.eq.${markerId}`)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking favorite:', error);
      throw error;
    }

    return { data: !!data, error: null };
  } catch (error) {
    console.error('Error in checkIfFavorite:', error);
    return { data: false, error };
  }
};

/**
 * Add billboard to favorites
 * @param {string} userId - User UUID
 * @param {string} billboardId - Billboard UUID
 * @param {string} markerId - Marker ID (optional)
 * @returns {Promise<Object>} Created favorite object
 */
export const addToFavorites = async (userId, billboardId, markerId = null) => {
  try {
    const favoriteData = {
      user_id: userId,
      billboard_id: billboardId,
    };

    if (markerId) {
      favoriteData.marker_id = markerId;
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([favoriteData])
      .select()
      .single();

    if (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in addToFavorites:', error);
    return { data: null, error };
  }
};

/**
 * Remove billboard from favorites
 * @param {string} userId - User UUID
 * @param {string} billboardId - Billboard UUID or marker ID
 * @returns {Promise<Object>} Success status
 */
export const removeFromFavorites = async (userId, billboardId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .or(`billboard_id.eq.${billboardId},marker_id.eq.${billboardId}`);

    if (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }

    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Error in removeFromFavorites:', error);
    return { data: null, error };
  }
};

// ============================================
// PROFILE API
// ============================================

/**
 * Get user profile
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} Profile object
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { data: null, error };
  }
};

/**
 * Update user profile
 * @param {string} userId - User UUID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { data: null, error };
  }
};

// ============================================
// SEARCH API
// ============================================

/**
 * Search billboards by keyword
 * @param {string} keyword - Search keyword
 * @param {string} city - City name (default: 'Mardan')
 * @returns {Promise<Array>} Array of matching billboards
 */
export const searchBillboards = async (keyword, city = 'Mardan') => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('city', city)
      .eq('is_active', true)
      .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,business.ilike.%${keyword}%,category.ilike.%${keyword}%`)
      .order('views', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error searching billboards:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in searchBillboards:', error);
    return { data: null, error };
  }
};

/**
 * Get billboards by category
 * @param {string} category - Category name
 * @param {string} city - City name (default: 'Mardan')
 * @returns {Promise<Array>} Array of billboards in category
 */
export const getBillboardsByCategory = async (category, city = 'Mardan') => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('category', category)
      .eq('city', city)
      .eq('is_active', true)
      .order('views', { ascending: false });

    if (error) {
      console.error('Error fetching billboards by category:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getBillboardsByCategory:', error);
    return { data: null, error };
  }
};

// ============================================
// EXPORT DEFAULT (for convenience)
// ============================================

export default {
  // Billboards
  getTrendingBillboards,
  getAllBillboards,
  getBillboardById,
  getBillboardByMarkerId,
  incrementBillboardViews,
  
  // Map
  getMapBillboards,
  
  // Interests
  getAllInterests,
  getUserInterests,
  saveUserInterests,
  
  // Favorites
  getUserFavorites,
  checkIfFavorite,
  addToFavorites,
  removeFromFavorites,
  
  // Profile
  getUserProfile,
  updateUserProfile,
  
  // Search
  searchBillboards,
  getBillboardsByCategory,
};

