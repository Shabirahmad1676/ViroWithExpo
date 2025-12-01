import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Image, ActivityIndicator, Dimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getBillboardById, incrementBillboardViews, checkIfFavorite, addToFavorites, removeFromFavorites } from '../../services/apiService'
import { useAuth } from '../../AuthContext/UserAuth'

const { width } = Dimensions.get('window')

const BillBoardDetailsScreen = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const [adData, setAdData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchBillboardDetails()
      if (user) {
        checkFavoriteStatus()
      }
    }
  }, [id, user])

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await checkIfFavorite(user.id, id)
      setIsFavorite(data)
    } catch (err) {
      console.error('Error checking favorite:', err)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      // Prompt login or show toast
      alert('Please login to save billboards')
      return
    }

    try {
      setFavLoading(true)
      if (isFavorite) {
        await removeFromFavorites(user.id, id)
        setIsFavorite(false)
      } else {
        await addToFavorites(user.id, id)
        setIsFavorite(true)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    } finally {
      setFavLoading(false)
    }
  }

  const fetchBillboardDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await getBillboardById(id)

      if (fetchError) {
        console.error('Error fetching billboard:', fetchError)
        setError(fetchError.message)
        setAdData(null)
      } else if (data) {
        const formattedData = {
          ...data,
          views: formatViews(data.views || 0),
          image: data.image_url ? { uri: data.image_url } : require('../../assets/coca.jpg'),
          fullDescription: data.full_description || data.description,
          contact: data.phone_no || data.contact,
          features: data.features || []
        }
        setAdData(formattedData)
        await incrementBillboardViews(id)
      } else {
        setError('Billboard not found')
        setAdData(null)
      }
    } catch (err) {
      console.error('Error in fetchBillboardDetails:', err)
      setError(err.message)
      setAdData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    )
  }

  if (!adData || error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4757" />
          <Text style={styles.errorText}>{error || 'Ad not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Header Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={adData.image}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {/* Dark Overlay instead of LinearGradient */}
          <View style={styles.darkOverlay} />

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, isFavorite && styles.favoriteActive]}
              onPress={toggleFavorite}
              disabled={favLoading}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#ff4757" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          {/* Title Overlay */}
          <View style={styles.titleOverlay}>
            <View style={styles.badgesRow}>
              {adData.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{adData.category}</Text>
                </View>
              )}
              {adData.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{adData.discount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.title} numberOfLines={2}>{adData.title}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{adData.rating} (120 reviews)</Text>
              <View style={styles.dotSeparator} />
              <Ionicons name="eye-outline" size={16} color="#fff" />
              <Text style={styles.viewsText}>{adData.views} views</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Business Info */}
          <View style={styles.section}>
            <Text style={styles.businessName}>{adData.business}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#667eea" />
              <Text style={styles.locationText}>{adData.location}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="navigate" size={20} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{adData.fullDescription}</Text>
          </View>

          {/* Features */}
          {adData.features && adData.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {adData.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureIconBg}>
                      <Ionicons name="checkmark" size={14} color="#667eea" />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Contact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <View style={styles.contactCard}>
              <View style={styles.contactRow}>
                <View style={styles.contactIconBg}>
                  <Ionicons name="call-outline" size={20} color="#667eea" />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{adData.contact}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.contactRow}>
                <View style={styles.contactIconBg}>
                  <Ionicons name="time-outline" size={20} color="#667eea" />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Hours</Text>
                  <Text style={styles.contactValue}>{adData.hours}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  )
}

export default BillBoardDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  favoriteActive: {
    backgroundColor: '#fff',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  badgesRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  discountBadge: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    opacity: 0.7,
  },
  viewsText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  businessName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: '#666',
    marginLeft: 6,
    fontSize: 15,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#667eea',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f2ff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e6ff',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f2ff',
  },
  featureIconBg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f2ff',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e6ff',
    marginVertical: 16,
  },
})