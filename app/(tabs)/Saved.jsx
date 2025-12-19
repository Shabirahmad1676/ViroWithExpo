import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { FadeIn, SlideIn } from '../../components/animations'
import { ScreenHeader } from '../../components/ScreenHeader'
import CouponCard from '../../components/CouponCard'

import { useFocusEffect } from 'expo-router'
import { getUserFavorites, removeFromFavorites, getUserCoupons } from '../../services/apiService'
import { useAuth } from '../../AuthContext/UserAuth'

const Saved = () => {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'coupons'
  const [savedItems, setSavedItems] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchData()
      } else {
        setSavedItems([])
        setCoupons([])
        setLoading(false)
      }
    }, [user, activeTab])
  )

  const fetchData = async () => {
    try {
      setLoading(true)

      if (activeTab === 'saved') {
        const { data, error } = await getUserFavorites(user.id)
        if (error) {
          console.error('Error fetching favorites:', error)
          setSavedItems([])
        } else {
          const formattedItems = data.map(item => ({
            id: item.billboards.id,
            title: item.billboards.title,
            category: item.billboards.category,
            image: item.billboards.image_url ? { uri: item.billboards.image_url } : require('../../assets/coca.jpg'),
          }))
          setSavedItems(formattedItems)
        }
      } else {
        const { data, error } = await getUserCoupons(user.id)
        if (error) {
          console.error('Error fetching coupons:', error);
          setCoupons([])
        } else {
          setCoupons(data || [])
        }
      }
    } catch (err) {
      console.error('Error in fetchData:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (itemId) => {
    try {
      setSavedItems(prev => prev.filter(item => item.id !== itemId))
      const { error } = await removeFromFavorites(user.id, itemId)
      if (error) fetchFavorites() // Revert if failed
    } catch (err) {
      console.error('Error in handleUnsave:', err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          title="My Wallet"
          subtitle="Saved items & Coupons"
          icon="wallet-outline"
          iconColor="#667eea"
        />

        {/* Custom Segmented Control */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved Ads</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'coupons' && styles.activeTab]}
            onPress={() => setActiveTab('coupons')}
          >
            <Text style={[styles.tabText, activeTab === 'coupons' && styles.activeTabText]}>My Coupons</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* SAVED TAB CONTENT */}
            {activeTab === 'saved' && (
              savedItems.length === 0 ? (
                <EmptyState
                  icon="bookmark-outline"
                  title="No Saved Items"
                  message="Start saving your favorite billboards to see them here"
                />
              ) : (
                <View style={styles.itemsContainer}>
                  {savedItems.map((item, index) => (
                    <FadeIn key={item.id} delay={100 + index * 100}>
                      <View style={styles.savedItem}>
                        <Image source={item.image} style={styles.savedItemImage} />
                        <View style={styles.savedItemContent}>
                          <Text style={styles.savedItemTitle} numberOfLines={2}>
                            {item.title}
                          </Text>
                          <Text style={styles.savedItemCategory}>{item.category}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.unsaveButton}
                          onPress={() => handleUnsave(item.id)}
                        >
                          <Ionicons name="bookmark" size={24} color="#ff4757" />
                        </TouchableOpacity>
                      </View>
                    </FadeIn>
                  ))}
                </View>
              )
            )}

            {/* COUPONS TAB CONTENT */}
            {activeTab === 'coupons' && (
              coupons.length === 0 ? (
                <EmptyState
                  icon="pricetag-outline"
                  title="No Coupons Yet"
                  message="Visit AR billboards to find and collect exclusive coupons!"
                />
              ) : (
                <View style={styles.itemsContainer}>
                  {coupons.map((userCoupon, index) => (
                    <CouponCard
                      key={userCoupon.id}
                      title={userCoupon.promos?.subtext || "Limited Offer"}
                      discountAmount={userCoupon.promos?.message || "Special Deal"}
                      discountCode={userCoupon.coupon_code}
                      expiryDate={Date.now() + 86400000 * 30} // 30 days validity
                    />
                  ))}
                </View>
              )
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const EmptyState = ({ icon, title, message }) => (
  <FadeIn delay={200}>
    <SlideIn direction="up" delay={200}>
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name={icon} size={80} color="#e0e0e0" />
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtext}>{message}</Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Ionicons name="map" size={20} color="#fff" />
          <Text style={styles.exploreButtonText}>Find on Map</Text>
        </TouchableOpacity>
      </View>
    </SlideIn>
  </FadeIn>
);

export default Saved

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    paddingTop: 70,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  savedItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  savedItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  savedItemContent: {
    flex: 1,
  },
  savedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  savedItemCategory: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  unsaveButton: {
    padding: 8,
  },
})
