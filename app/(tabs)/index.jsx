import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Button, 
  ScrollView, 
  Image, 
  StyleSheet, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

export default function App() {
  const [session, setSession] = useState(null)
  // const[billboard,setBillboard] = useState([])

  const router = useRouter()

  // Mock data for trending ads in Mardan
  const trendingAds = [
    {
      id: 1,
      title: "KFC Mardan - New Spicy Wings",
      business: "KFC Mardan",
      location: "Mardan City Center",
      image: require('../../assets/kfc.jpg'),
      rating: 4.5,
      views: "2.3k",
      category: "Food & Beverage",
      discount: "20% OFF",
      description: "Try our new spicy wings with special Mardan sauce. Limited time offer!"
    },
    {
      id: 2,
      title: "Nike Store - Sports Collection",
      business: "Nike Mardan",
      location: "Mardan Mall",
      image: require('../../assets/nike.jpg'),
      rating: 4.8,
      views: "1.8k",
      category: "Fashion & Sports",
      discount: "30% OFF",
      description: "Latest sports collection with premium quality. Perfect for athletes!"
    },
    {
      id: 3,
      title: "Coca-Cola Refreshment Zone",
      business: "Coca-Cola Mardan",
      location: "Mardan Highway",
      image: require('../../assets/coca.jpg'),      // image: require('../../assets/coca.jpg'),
      rating: 4.2,
      views: "3.1k",
      category: "Beverages",
      discount: "Buy 2 Get 1 Free",
      description: "Stay refreshed with Coca-Cola. Special deals for Mardan residents!"
    },
    
  ]


  //this is for fetching data from SupaBase
// useEffect(() => {
//   const fetchBillboards = async () => {
//     let { data, error } = await supabase.from("billboarddataformap").select("*");
//     if (error) {
//       console.error(error);
//     } else {
//       setBillboard(data);
//       console.log('From Supabase')
//     }
//   };
//   fetchBillboards();
// }, []);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const LogOut = async () => {
    await supabase.auth.signOut()
    router.push('/(auth)/LogIn')
  }

  const renderAdCard = (ad) => (
    <TouchableOpacity key={ad.id} style={styles.adCard}>
      <View style={styles.imageContainer}>
        <Image source={ad.image} style={styles.adImage} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{ad.discount}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{ad.category}</Text>
        </View>
      </View>
      
      <View style={styles.adContent}>
        <View style={styles.adHeader}>
          <Text style={styles.adTitle} numberOfLines={2}>{ad.title}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{ad.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.businessName}>{ad.business}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{ad.location}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {ad.description}
        </Text>
        
        {/* <View style={styles.adFooter}>
          <View style={styles.viewsContainer}>
            <Ionicons name="eye-outline" size={14} color="#666" />
            <Text style={styles.viewsText}>{ad.views} views</Text>
          </View> */}
          
          {/* Buttons */}
          <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.viewButton} onPress={() => router.push(`/post/${ad.id}`)}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.SaveButton} onPress={() => console.log("Saved",ad.id)}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          </View>
        </View>
      
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      

      {/* Trending Section */}
      <View style={styles.trendingSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}> Top Trending Ads</Text>
          <Text style={styles.sectionSubtitle}>Discover the best deals in Mardan</Text>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {trendingAds.map(renderAdCard)}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: 'black',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  trendingSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  adContent: {
    padding: 16,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#856404',
    marginLeft: 2,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  SaveButton:{
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
})