import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { supabase } from "../../utils/supabase"
import { Ionicons } from "@expo/vector-icons"
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { useAuth } from "../../AuthContext/UserAuth"
import { FadeIn, SlideIn } from "../../components/animations"
import { ScreenHeader } from "../../components/ScreenHeader"

const Settings = () => {
  const router = useRouter()
  const { user, signOut, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: async () => {
            const { error } = await signOut()
            if (error) {
              Alert.alert("Error", "Could not log out")
            } else {
              router.replace("/(auth)/LogIn")
            }
          }
        }
      ]
    )
  }

  const fetchUserProfile = async (userId) => {
    try {
      const { getUserProfile } = await import('../../services/apiService')
      const { data, error } = await getUserProfile(userId)

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
    if (!user) {
      router.replace('/(auth)/LogIn')
      return
    }

    const loadProfile = async () => {
      const profile = await fetchUserProfile(user.id)
      setUserProfile(profile)
      setLoading(false)
    }

    loadProfile()
  }, [user])

  const menuItems = [
    { 
      title: "Change Interests", 
      icon: "grid-outline",
      iconColor: "#667eea",
      onPress: () => router.push("/Intrest") 
    },
    { 
      title: "Privacy Policy", 
      icon: "shield-checkmark-outline",
      iconColor: "#57c3ff",
      onPress: () => router.push("/PrivacyPolicy")
    },
    { 
      title: "Terms & Conditions", 
      icon: "document-text-outline",
      iconColor: "#4ed964",
      onPress: () => Alert.alert("Coming Soon", "Terms & Conditions will be available soon")
    },
  ]

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          title="Settings"
          subtitle="Manage your preferences"
          icon="settings-outline"
          iconColor="#667eea"
        />

        {/* User Profile Section */}
        <FadeIn delay={200}>
          <SlideIn direction="up" delay={200}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-circle" size={70} color="#667eea" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </Text>
                <View style={styles.emailContainer}>
                  <Ionicons name="mail" size={14} color="#666" />
                  <Text style={styles.userEmail}>
                    {userProfile?.email || user?.email || 'No email available'}
                  </Text>
                </View>
              </View>
            </View>
          </SlideIn>
        </FadeIn>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <FadeIn key={index} delay={300 + index * 100}>
              <SlideIn direction="up" delay={300 + index * 100}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: `${item.iconColor}20` }]}>
                    <Ionicons name={item.icon} size={24} color={item.iconColor} />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              </SlideIn>
            </FadeIn>
          ))}
        </View>

        {/* Logout Button */}
        <FadeIn delay={600}>
          <SlideIn direction="up" delay={600}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={24} color="#ff4757" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </SlideIn>
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    paddingTop: 70,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  logoutButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ff4757',
    marginBottom: 20,
    shadowColor: '#ff4757',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff4757',
    marginLeft: 12,
  },
})
