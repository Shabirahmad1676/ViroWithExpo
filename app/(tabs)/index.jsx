import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getTrendingBillboards } from '../../services/apiService'
import { useAuth } from '../../AuthContext/UserAuth'
import { AdCard } from '../../components/AdCard'
import { FadeIn, SlideIn } from '../../components/animations'

export default function App() {
  const router = useRouter()
  const { user } = useAuth()
  const [trendingAds, setTrendingAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTrendingAds()
  }, [])

  const fetchTrendingAds = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: apiError } = await getTrendingBillboards('Mardan')
      
      if (apiError) {
        console.error('Error fetching trending ads:', apiError)
        setError(apiError.message)
        setTrendingAds([])
      } else {
        const formattedData = data?.map(ad => ({
          ...ad,
          views: formatViews(ad.views || 0),
          image: ad.image_url ? { uri: ad.image_url } : require('../../assets/images/icon.png')
        })) || []
        setTrendingAds(formattedData)
      }
    } catch (err) {
      console.error('Error in fetchTrendingAds:', err)
      setError(err.message)
      setTrendingAds([])
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

  const handleViewDetails = async (ad) => {
    if (ad.id) {
      const { incrementBillboardViews } = await import('../../services/apiService')
      await incrementBillboardViews(ad.id)
    }
    router.push(`/post/${ad.id}`)
  }

  const handleSave = (ad) => {
    console.log('Saved', ad.id)
  }

  if (loading && trendingAds.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading trending ads...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />

      {/* Header */}
      <FadeIn duration={600}>
        <SlideIn direction="down" delay={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.headerTitle}>Top Trending</Text>
                <Text style={styles.headerSubtitle}>Discover the best deals in Mardan</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="trending-up" size={28} color="#667eea" />
              </View>
            </View>
          </View>
        </SlideIn>
      </FadeIn>

      {/* Content */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff4757" />
          <Text style={styles.errorText}>Error loading ads</Text>
          <Text style={styles.errorSubtext}>Pull down to refresh</Text>
        </View>
      )}

      {trendingAds.length === 0 && !loading && !error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No trending ads available</Text>
          <Text style={styles.emptySubtext}>Check back later for new deals!</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTrendingAds}
              tintColor="#667eea"
            />
          }
        >
          {trendingAds.map((ad, index) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onPress={handleViewDetails}
              onSave={handleSave}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    paddingTop: 70,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
})
