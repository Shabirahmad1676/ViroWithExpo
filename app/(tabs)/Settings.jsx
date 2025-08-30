import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { supabase } from "../../utils/supabase"
import { Ionicons } from "@expo/vector-icons"
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'

const Settings = () => {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert("Error", "Could not log out")
    } else {
      router.replace("/(auth)/LogIn")
    }
  }

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)

        if (session) {
          // Fetch user profile data
          const profile = await fetchUserProfile(session.user.id)
          setUserProfile(profile)
        } else {
          router.replace('/(auth)/LogIn')
        }
      } catch (error) {
        console.error('Session check error:', error)
        router.replace('/(auth)/LogIn')
      }

      setLoading(false)
    }

    checkSession()

    // Handle future auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
      } else {
        router.replace('/(auth)/LogIn')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const menuItems = [
    { title: "Change Interests", onPress: () => router.push("/Intrest") },
    { title: "Privacy", onPress: () => router.push("/PrivacyPolicy")},
  ]

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={60} color="#1ef4d7" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {userProfile?.full_name || session?.user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile?.email || session?.user?.email || 'No email available'}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={item.onPress}
          >
            <Text style={styles.itemText}>
              {item.title}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          onPress={handleLogout} 
          style={[styles.item, styles.logoutItem]}
        >
          <Text style={styles.logoutText}>LogOut</Text>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  list: { 
    borderTopWidth: 1, 
    borderColor: "#ddd" 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemText: { 
    fontSize: 18, 
    color: "#333" 
  },
  logoutItem: {
    backgroundColor: "#fff5f5",
    marginTop: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 18,
    color: "#ff4444",
    fontWeight: '500'
  }
})
