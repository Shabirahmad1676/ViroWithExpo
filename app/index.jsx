import 'react-native-url-polyfill/auto'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../AuthContext/UserAuth'
import { getUserInterests } from '../services/apiService'

export default function App() {
  const router = useRouter()
  const { user, loading, initialLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount before attempting navigation
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Wait for both initial loading to complete AND component to be mounted
    if (!initialLoading && !loading && mounted) {
      // Use setTimeout to ensure router is ready
      const timer = setTimeout(() => {
        if (user) {
          // User is logged in, check if they have interests
          checkUserInterests()
        } else {
          // Not logged in → go to login
          router.replace('/(auth)/LogIn')
        }
      }, 100) // Small delay to ensure router is ready

      return () => clearTimeout(timer)
    }
  }, [user, loading, initialLoading, mounted])

  const checkUserInterests = async () => {
    try {
      const { data, error } = await getUserInterests(user.id)

      if (error) {
        console.error('Error checking user interests:', error)
        // On error, still allow access but redirect to interests
        router.replace('/Intrest')
        return
      }

      if (data && data.interests && data.interests.length > 0) {
        // old user with saved interests → go to main app
        router.replace('/(tabs)')
      } else {
        // new user → go to interests page
        router.replace('/Intrest')
      }
    } catch (error) {
      console.error('Error checking user interests:', error)
      router.replace('/Intrest')
    }
  }

  // Show loading while auth is initializing
  if (initialLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading...</Text>
      </View>
    )
  }

  return null
}
