import { View, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapboxMap from '../../components/MapboxMap'
import { useLocalSearchParams } from 'expo-router'

const MapScreen = () => {
  const { lat, long, targetId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <MapboxMap
        focusCoords={lat && long ? [parseFloat(long), parseFloat(lat)] : null}
        focusId={targetId}
      />
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})