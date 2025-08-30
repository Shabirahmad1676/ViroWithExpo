import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { View, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        // check if user already has interests
        const { data, error } = await supabase
          .from('user_interests')
          .select('interests')
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (error) {
          console.error(error)
        }

        if (data && data.interests && data.interests.length > 0) {
          // old user with saved interests → go to main app
          router.replace('/(tabs)')
        } else {
          // new user → go to interests page
          router.replace('Intrest')
        }
      } else {
        // not logged in → go to login
        router.replace('/(auth)/LogIn')
      }

      setLoading(false)
    }

    checkSession()

    // handle future auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        checkSession()
      } else {
        router.replace('/(auth)/LogIn')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading...</Text>
      </View>
    )
  }

  return null
}
