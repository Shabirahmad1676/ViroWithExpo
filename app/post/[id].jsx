import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const BillBoardDetailsScreen = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [adData, setAdData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data - replace with your actual data source
  const mockAdsData = {
    1: {
      id: 1,
      title: "KFC Mardan - New Spicy Wings",
      business: "KFC Mardan",
      location: "Mardan City Center",
      image: require('../../assets/kfc.jpg'),
      rating: 4.5,
      views: "2.3k",
      category: "Food & Beverage",
      discount: "20% OFF",
      description: "Try our new spicy wings with special Mardan sauce. Limited time offer!",
      fullDescription: "Experience the perfect blend of spices in our new spicy wings. Made with locally sourced ingredients and our signature Mardan sauce. This limited-time offer includes free fries and a soft drink with every order. Perfect for family gatherings and casual dining.",
      contact: "+92 300 1234567",
      address: "Shop #15, Mardan City Center, Main Market Road",
      hours: "10:00 AM - 11:00 PM",
      features: ["Free WiFi", "Parking Available", "Delivery Service", "Family Friendly"]
    },
    2: {
      id: 2,
      title: "Nike Store - Sports Collection",
      business: "Nike Mardan",
      location: "Mardan Mall",
      image: require('../../assets/nike.jpg'),
      rating: 4.8,
      views: "1.8k",
      category: "Fashion & Sports",
      discount: "30% OFF",
      description: "Latest sports collection with premium quality. Perfect for athletes!",
      fullDescription: "Discover the latest Nike sports collection featuring premium quality athletic wear and footwear. From running shoes to training gear, we have everything you need to perform at your best. Our collection includes both men's and women's apparel with the latest technology and comfort features.",
      contact: "+92 300 7654321",
      address: "Level 2, Mardan Mall, GT Road",
      hours: "9:00 AM - 10:00 PM",
      features: ["Premium Quality", "Latest Collection", "Size Exchange", "Athlete Discount"]
    },
    3: {
      id: 3,
      title: "Coca-Cola Refreshment Zone",
      business: "Coca-Cola Mardan",
      location: "Mardan Highway",
      image: require('../../assets/coca.jpg'),
      rating: 4.2,
      views: "3.1k",
      category: "Beverages",
      discount: "Buy 2 Get 1 Free",
      description: "Stay refreshed with Coca-Cola. Special deals for Mardan residents!",
      fullDescription: "Quench your thirst with the world's favorite beverage. Our Coca-Cola Refreshment Zone offers a variety of soft drinks, juices, and snacks. Perfect for travelers and locals alike. Enjoy our special 'Buy 2 Get 1 Free' offer on all Coca-Cola products.",
      contact: "+92 300 9876543",
      address: "Mardan Highway, Near Bus Stand",
      hours: "8:00 AM - 12:00 AM",
      features: ["24/7 Service", "Drive-Thru", "Cold Beverages", "Snacks Available"]
    }
  }

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      const data = mockAdsData[id]
      setAdData(data)
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!adData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ad not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Text style={styles.discountBadge}>{adData.discount}</Text>
          <Text style={styles.categoryBadge}>{adData.category}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Rating */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{adData.title}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{adData.rating}</Text>
            </View>
          </View>

          {/* Business Info */}
          <Text style={styles.businessName}>{adData.business}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{adData.location}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{adData.fullDescription}</Text>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color="#007bff" />
              <Text style={styles.contactText}>{adData.contact}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={16} color="#007bff" />
              <Text style={styles.contactText}>{adData.address}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={16} color="#007bff" />
              <Text style={styles.contactText}>{adData.hours}</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {adData.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={20} color="#666" />
              <Text style={styles.statText}>{adData.views} views</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BillBoardDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#f0f0f0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#ff4757',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginLeft: 4,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
})