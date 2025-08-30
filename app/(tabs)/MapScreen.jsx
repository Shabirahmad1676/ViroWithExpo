import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomMark from '../../components/CustomMark'
const MapScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>  
      <CustomMark/>
    </SafeAreaView>
  )
}

export default MapScreen