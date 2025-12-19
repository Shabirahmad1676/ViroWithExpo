import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, Platform, StatusBar } from 'react-native'
import React, { useState } from 'react'
import MapboxMap from '../../components/MapboxMap'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'fashion', label: 'Fashion', icon: 'checkroom' },
  { id: 'tech', label: 'Tech', icon: 'computer' },
  { id: 'services', label: 'Services', icon: 'build' },
]

const MapScreen = () => {
  const { lat, long, targetId, showDirection } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const onScanPress = () => {
    // FYP Flow: Navigate to Camera/AR screen for billboard interaction
    router.push('/(tabs)/Camera');
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={StyleSheet.absoluteFill}>
        <MapboxMap
          focusCoords={lat && long ? [parseFloat(long), parseFloat(lat)] : null}
          focusId={targetId}
          searchQuery={searchQuery}
          category={selectedCategory}
          showDirection={showDirection === 'true'}
        />
      </View>

      {/* Top Search & Filter Section */}
      <SafeAreaView style={styles.topOverlay} edges={['top']}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#555" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search billboards, areas..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>M</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                selectedCategory === cat.id && styles.chipActive
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <MaterialIcons
                name={cat.icon}
                size={18}
                color={selectedCategory === cat.id ? '#FFF' : '#444'}
              />
              <Text style={[
                styles.chipText,
                selectedCategory === cat.id && styles.chipTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Floating Action Buttons (Right Side) */}
      <View style={styles.fabContainer}>
        {/* My Location FAB */}
        <TouchableOpacity style={styles.fabSmall} onPress={() => {/* Trigger location (via ref usually) */ }}>
          <MaterialIcons name="my-location" size={24} color="#333" />
        </TouchableOpacity>

        {/* FYP: Scan Billboard FAB (Prominent) */}
        <TouchableOpacity style={styles.fabScan} onPress={onScanPress}>
          <Ionicons name="scan-outline" size={28} color="#FFF" />
          <Text style={styles.fabScanText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: 40,
  },
  profileButton: {
    marginLeft: 8,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7B1FA2', // Purple brand accent
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoriesContent: {
    paddingRight: 16,
    paddingBottom: 8, // For shadow visibility
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chipActive: {
    backgroundColor: '#333', // Dark active state like Google Maps
    borderColor: '#333',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  chipTextActive: {
    color: '#FFF',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 30, // Above bottom tab bar usually
    alignItems: 'center',
  },
  fabSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
  },
  fabScan: {
    width: 64,
    height: 64,
    marginBottom: 70,
    borderRadius: 20, // Squircle shape
    backgroundColor: '#7B1FA2', // High contrast brand color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7B1FA2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabScanText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  }
})