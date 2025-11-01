import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../AuthContext/UserAuth'
import { getAllInterests, getUserInterests, saveUserInterests } from '../services/apiService'
import { CustomButton } from '../components/ui/CustomButton'
import { Ionicons } from '@expo/vector-icons'

const Interest = () => {
  const router = useRouter()
  const { user } = useAuth()
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
    try {
      const { data, error } = await getAllInterests()
      if (!error && data) {
        setOptions(data.map((i) => i.name))
      }
    } catch (err) {
      console.error('Error fetching interests:', err)
    }
  }

  // Check if user already has interests
  const checkIfAlreadySet = async () => {
    try {
      if (!user) return setInitialLoading(false)

      const { data, error } = await getUserInterests(user.id)

      if (error) {
        console.error('Error checking user interests:', error)
        setInitialLoading(false)
        return
      }

      if (data?.interests?.length > 0) {
        // interests already saved → skip this page
        router.replace('/(tabs)')
      } else {
        // no interests yet → let user pick
        setInitialLoading(false)
      }
    } catch (err) {
      console.error('Error checking interests:', err)
      setInitialLoading(false)
    }
  }

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const saveInterests = async () => {
    try {
      setLoading(true)
      if (!user) return Alert.alert('Error', 'User not logged in')

      const { data, error } = await saveUserInterests(user.id, selected)

      if (error) {
        Alert.alert('Error', 'Could not save interests')
        console.error('Error saving interests:', error)
      } else {
        Alert.alert('Saved', 'Your interests have been saved')
        router.replace('/(tabs)')
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Could not save interests')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Checking your interests...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Interests</Text>
        <Text style={styles.subtitle}>
          Select as many as you like to personalize your experience
        </Text>
        {selected.length > 0 && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#007bff" />
            <Text style={styles.selectedText}>
              {selected.length} selected
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                selected.includes(option) && styles.optionSelected,
              ]}
              onPress={() => toggleInterest(option)}
              activeOpacity={0.7}
            >
              {selected.includes(option) && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                </View>
              )}
              <Text
                style={[
                  styles.optionText,
                  selected.includes(option) && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title={
            selected.length === 0
              ? 'Select at least one interest'
              : `Continue (${selected.length})`
          }
          onPress={saveInterests}
          loading={loading}
          disabled={loading || selected.length === 0}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  )
}

export default Interest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  selectedText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  option: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 6,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    shadowColor: '#007bff',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  saveButton: {
    width: '100%',
  },
})
