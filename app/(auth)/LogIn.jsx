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
import { Ionicons } from '@expo/vector-icons'
import { Input, Button } from 'react-native-elements'
import { useRouter } from 'expo-router'
import { supabase } from '../../utils/supabase'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      Alert.alert('Sign In Failed', error.message)
    } else {
      router.push('Intrest')
    }
    setLoading(false)
  }

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
              <Ionicons name="cube-outline" size={60} color="#667eea" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              labelStyle={styles.inputLabel}
            />

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/ForgotPass')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={signInWithEmail}
              loading={loading}
              disabled={loading}
              buttonStyle={styles.signInButton}
              titleStyle={styles.signInTitle}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/SignUp')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LogIn

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
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 14,
  },
  signInTitle: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
  },
  signUpLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '700',
  },
})
