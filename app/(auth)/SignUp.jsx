import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../utils/supabase'
import { Input, Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../AuthContext/UserAuth'


const SignUp = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [loading, setLoading] = useState(false)
  const router = useRouter()

  // --- Signup Logic (unchanged) ---
  const { signUp, loading } = useAuth()
  const handleSignUp = async () => {
    const { error } = await signUp(email, password, { full_name: userName })
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      router.push('/(auth)/LogIn')
    }
  }

  // --- UI Section ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="rocket-outline" size={60} color="#667eea" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your amazing journey with us</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              leftIcon={{ type: 'ionicon', name: 'person-outline', color: '#667eea' }}
              placeholder="Enter your full name"
              value={userName}
              onChangeText={setUserName}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              labelStyle={styles.inputLabel}
            />

            <Input
              label="Email"
              leftIcon={{ type: 'ionicon', name: 'mail-outline', color: '#667eea' }}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              labelStyle={styles.inputLabel}
            />

            <Input
              label="Password"
              leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: '#667eea' }}
              placeholder="Enter your password (min 6 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              labelStyle={styles.inputLabel}
            />

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              buttonStyle={styles.signUpButton}
              titleStyle={styles.signUpTitle}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign In Redirect */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/LogIn')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUp

// ---------------------------
// 💅 Modernized Styling
// ---------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputLabel: {
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 14,
  },
  signUpTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#666',
  },
  signInLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '700',
  },
})
