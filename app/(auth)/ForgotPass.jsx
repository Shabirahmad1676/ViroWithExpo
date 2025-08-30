import { View, Text, TextInput,TouchableOpacity, StyleSheet } from 'react-native'
import React,{useState} from 'react'
import { useRouter } from 'expo-router'

const ForgotPass = () => {
  const[userName,setUserName] = useState('')
  const router = useRouter()

  return (
    <View>
      <TextInput  value={userName} onChangeText={setUserName} placeholder='Enter email'/>
      <TouchableOpacity onPress={()=>router.push('(auth)/ResetPass')} >
        <Text style={styles.btn} >Reset Password</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ForgotPass


const styles=StyleSheet.create({
  btn : {
    backgroundColor:'red'
  }
})