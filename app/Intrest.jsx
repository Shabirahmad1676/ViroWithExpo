import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter } from 'expo-router'

const Interest = () => {
  const router = useRouter()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await fetchInterests()
      await checkIfAlreadySet()
    }
    init()
  }, [])

  // Fetch available interests
  const fetchInterests = async () => {
    const { data, error } = await supabase
      .from('interests')
      .select('name')
      .order('name')

    if (!error && data) setOptions(data.map(i => i.name))
  }

  // Check if user already has interests
  const checkIfAlreadySet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setInitialLoading(false)

      const { data, error } = await supabase
        .from('user_interests')
        .select('interests')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data?.interests?.length > 0) {
        // interests already saved → skip this page
        router.replace('/(tabs)')
      } else {
        // no interests yet → let user pick
        setInitialLoading(false)
      }
    } catch (err) {
      console.error("Error checking interests:", err)
      setInitialLoading(false)
    }
  }

  const toggleInterest = (interest) => {
    setSelected(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const saveInterests = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return Alert.alert("Error", "User not logged in")

      const { data: existing } = await supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('user_interests')
          .update({ interests: selected, created_at: new Date().toISOString() })
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('user_interests')
          .insert([{ user_id: user.id, interests: selected }])
      }

      Alert.alert("Saved", "Your interests have been saved")
      router.replace("/(tabs)")
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Could not save interests")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Checking your interests...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Interests</Text>
      <Text style={styles.subtitle}>Select as many as you like</Text>

      <View style={styles.grid}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selected.includes(option) && styles.optionSelected
            ]}
            onPress={() => toggleInterest(option)}
          >
            <Text style={[
              styles.optionText,
              selected.includes(option) && styles.optionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, selected.length === 0 && { opacity: 0.5 }]}
        disabled={loading || selected.length === 0}
        onPress={saveInterests}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save ({selected.length})</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Interest

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  subtitle: { fontSize: 14, textAlign: "center", color: "#666", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 20 },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 6,
    backgroundColor: "#f8f9fa"
  },
  optionSelected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  optionText: { fontSize: 16, color: "#333" },
  optionTextSelected: { color: "#fff", fontWeight: "600" },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
})
