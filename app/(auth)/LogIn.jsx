import { View, Text, TouchableOpacity, TextInput, AppState, Alert, StyleSheet  } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import {supabase} from '../../utils/supabase'
import { Input, Button } from 'react-native-elements'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  
    // Sign in with email and password
    async function signInWithEmail() {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      router.push('Intrest')
      if (error) Alert.alert(error.message)
      setLoading(false)
    }
  

    
    return (
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button 
            title="Don't have an account? Sign up" 
            type="clear"
            onPress={() => router.push('/(auth)/SignUp')} 
          />
        </View>
      </View>
    )
  
}

export default LogIn

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})