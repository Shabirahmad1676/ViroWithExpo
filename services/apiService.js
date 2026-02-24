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
 * Get all trending billboards for a city (default: 'Mardan')
 * @param {string} city - City name (default: 'Mardan')
 * @returns {Promise<Array>} Array of billboard objects
 */
export const getTrendingBillboards = async (city = 'Mardan') => {
  try {
    const { data, error } = await supabase
      .from('billboards')
      .select('*')
      .eq('city', city)
      .eq('is_active', true) // Showing all active ads regardless of trending status
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
      .from('billboarddataformap')
      .select('*')
      .eq('id', id)
      .maybeSingle();

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
      .eq('is_active', true)
      .maybeSingle();

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
    // 1. Log the event in analytics table
    await supabase
      .from('billboard_analytics')
      .insert([{
        billboard_id: id,
        event_type: 'view',
        // user_id: we could fetch it if we want strict tracking, but optional for now
      }]);

    // 2. Increment aggregate count on billboards table (keep this for valid display)
    const { data: current } = await supabase
      .from('billboards')
      .select('views')
      .eq('id', id)
      .maybeSingle();

    if (!current) {
      console.log('Billboard not found for incrementing views:', id);
      return { data: null, error: null }; // Graceful exit
    }

    // Increment views
    const { data, error } = await supabase
      .from('billboards')
      .update({ views: current.views + 1 })
      .eq('id', id)
      .select()
      .maybeSingle();

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
    const transformedData = mapData?.map(item => {
      // Ensure coords is a valid array of numbers [lon, lat]
      let coords = item.coords;

      // Handle Postgres array string format "{lon,lat}" if it comes as string
      if (typeof coords === 'string') {
        coords = coords.replace('{', '').replace('}', '').split(',').map(Number);
      } else if (Array.isArray(coords)) {
        coords = coords.map(Number);
      }

      return {
        id: item.id || item.billboard_id,
        billboard_id: item.billboard_id,
        title: item.title,
        coords: coords,
        image_url: item.image_url,
        location: item.location,
      };
    }) || [];

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
        billboards:billboards!favorites_billboard_id_fkey (*)
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
// REVIEWS API
// ============================================

/**
 * Get reviews for a billboard
 * @param {string} billboardId - Billboard UUID
 * @returns {Promise<Array>} Array of review objects
 */
export const getBillboardReviews = async (billboardId) => {
  try {
    const { data, error } = await supabase
      .from('billboard_reviews')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('billboard_id', billboardId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getBillboardReviews:', error);
    return { data: null, error };
  }
};

/**
 * Submit a review for a billboard
 * @param {string} userId - User UUID
 * @param {string} billboardId - Billboard UUID
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Review comment
 */
export const submitBillboardReview = async (userId, billboardId, rating, comment) => {
  try {
    const { data, error } = await supabase
      .from('billboard_reviews')
      .upsert([
        {
          user_id: userId,
          billboard_id: billboardId,
          rating,
          comment,
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'billboard_id,user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error submitting review:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in submitBillboardReview:', error);
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
      .order('views', { ascending: false })
      .limit(50);

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
// PROMOS API
// ============================================

/**
 * Get active location-based promos
 * @returns {Promise<Array>} Array of promo objects
 */
export const getPromos = async () => {
  try {
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching promos:', error);
      throw error;
    }

    // Transform if necessary to match component expectations
    // The DB columns (latitude, longitude, radius_km) need to map to our component's expected format (coords: [lon, lat], radiusKm)
    const formattedData = data.map(p => ({
      id: p.id,
      name: p.city,
      coords: [p.longitude, p.latitude],
      radiusKm: p.radius_km,
      message: p.message,
      subtext: p.subtext,
      billboardId: p.billboard_id,
      couponCode: p.coupon_code
    }));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Error in getPromos:', error);
    return { data: null, error };
  }
};

/**
 * Claim a coupon from a promo
 * @param {string} userId - User UUID
 * @param {string} promoId - Promo UUID
 * @param {string} couponCode - Coupon Code
 */
export const claimCoupon = async (userId, promoId, couponCode) => {
  try {
    const { data, error } = await supabase
      .from('user_coupons')
      .insert([
        { user_id: userId, promo_id: promoId, coupon_code: couponCode }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { data: null, error: { message: 'You have already claimed this coupon!' } };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error claiming coupon:', error);
    return { data: null, error };
  }
};

/**
 * Get user's saved coupons
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of coupon objects
 */
export const getUserCoupons = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_coupons')
      .select(`
          *,
          promos:promos (*),
          coupons:coupon_id (*)
        `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user coupons:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserCoupons:', error);
    return { data: null, error };
  }
};

/**
 * Get IDs of coupons already claimed by a user for a specific billboard
 * @param {string} userId - User UUID
 * @param {Array} couponIds - Array of coupon IDs to check
 */
export const getClaimedCouponIds = async (userId, couponIds) => {
  try {
    const { data, error } = await supabase
      .from('user_coupons')
      .select('coupon_id')
      .eq('user_id', userId)
      .in('coupon_id', couponIds);

    if (error) throw error;
    return { data: data.map(c => c.coupon_id), error: null };
  } catch (error) {
    console.error('Error in getClaimedCouponIds:', error);
    return { data: [], error };
  }
};


// ============================================
// COUPONS API
// ============================================

/**
 * Get coupons for a specific billboard
 * @param {string} billboardId - Billboard UUID
 * @returns {Promise<Array>} Array of coupon objects
 */
export const getBillboardCoupons = async (billboardId) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('billboard_id', billboardId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching billboard coupons:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getBillboardCoupons:', error);
    return { data: null, error };
  }
};

/**
 * Claim a coupon for a billboard
 * @param {string} userId - User UUID
 * @param {string} billboardId - Billboard UUID
 * @param {string} couponId - Coupon UUID
 */
export const claimBillboardCoupon = async (userId, billboardId, couponId) => {
  try {
    const { data, error } = await supabase
      .from('user_coupons')
      .insert([
        {
          user_id: userId,
          coupon_id: couponId,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { data: null, error: { message: 'You have already claimed this coupon!' } };
      }
      console.error('Error claiming billboard coupon:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in claimBillboardCoupon:', error);
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
  getBillboardReviews,
  submitBillboardReview,

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

  // Promos
  getPromos,
  claimCoupon,

  // Reviews
  getBillboardReviews,
  submitBillboardReview,

  // Coupons
  getUserCoupons,
  getBillboardCoupons,
  claimBillboardCoupon,
  getClaimedCouponIds,
};
