import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useRouter } from 'expo-router'
import { Input, Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../utils/supabase'
import { LinearGradient } from 'expo-linear-gradient'

const ForgotPass = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'myapp://reset-password',
    })

    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your inbox.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/ResetPass') }]
      )
    }
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
              <Ionicons name="key-outline" size={60} color="#7B1FA2" />
            </View>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive password reset instructions
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Input
              label="Email"
              leftIcon={{ type: 'ionicon', name: 'mail-outline', color: '#7B1FA2' }}
              onChangeText={setEmail}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
              keyboardType="email-address"
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              labelStyle={styles.inputLabel}
            />

            <Button
              title={loading ? 'Sending...' : 'Send Reset Email'}
              loading={loading}
              disabled={loading || !email}
              onPress={handleResetPassword}
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ['#7B1FA2', '#9C27B0'],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
              }}
              buttonStyle={styles.primaryButton}
              titleStyle={styles.primaryButtonTitle}
              disabledStyle={{ backgroundColor: '#ccc' }}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Remember your password? </Text>
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

export default ForgotPass

// ---------------------------
// 💅 Modernized Styling
// ---------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#7B1FA2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
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
    borderRadius: 20,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputLabel: {
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#7B1FA2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  primaryButtonTitle: {
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
    color: '#7B1FA2',
    fontWeight: '700',
  },
})
