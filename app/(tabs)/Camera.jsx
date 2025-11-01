import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { ScreenHeader } from '../../components/ScreenHeader'
import { Ionicons } from '@expo/vector-icons'

const Camera = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="AR Camera"
        subtitle="Scan billboards and view them in AR"
        icon="camera-outline"
        iconColor="#667eea"
      />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera" size={80} color="#ccc" />
        </View>
        <Text style={styles.title}>AR Camera</Text>
        <Text style={styles.subtitle}>
          Point your camera at billboard markers to view them in augmented reality
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default Camera

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    paddingTop: 70,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
})
