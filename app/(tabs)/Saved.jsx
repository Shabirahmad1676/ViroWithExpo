import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { FadeIn, SlideIn } from '../../components/animations'
import { ScreenHeader } from '../../components/ScreenHeader'

const Saved = () => {
  const [savedItems, setSavedItems] = useState([])

  const handleUnsave = (itemId) => {
    setSavedItems(savedItems.filter(item => item.id !== itemId))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader
          title="Saved Items"
          subtitle="Your favorite billboards"
          icon="bookmark-outline"
          iconColor="#667eea"
        />

        {/* Content */}
        {savedItems.length === 0 ? (
          <FadeIn delay={200}>
            <SlideIn direction="up" delay={200}>
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="bookmark-outline" size={80} color="#e0e0e0" />
                </View>
                <Text style={styles.emptyTitle}>No Saved Items</Text>
                <Text style={styles.emptySubtext}>
                  Start saving your favorite billboards to see them here
                </Text>
                <TouchableOpacity style={styles.exploreButton}>
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.exploreButtonText}>Explore Now</Text>
                </TouchableOpacity>
              </View>
            </SlideIn>
          </FadeIn>
        ) : (
          <View style={styles.savedItemsContainer}>
            {savedItems.map((item, index) => (
              <FadeIn key={item.id} delay={200 + index * 100}>
                <SlideIn direction="up" delay={200 + index * 100}>
                  <View style={styles.savedItem}>
                    <Image source={item.image} style={styles.savedItemImage} />
                    <View style={styles.savedItemContent}>
                      <Text style={styles.savedItemTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.savedItemCategory}>{item.category}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.unsaveButton}
                      onPress={() => handleUnsave(item.id)}
                    >
                      <Ionicons name="bookmark" size={24} color="#ff4757" />
                    </TouchableOpacity>
                  </View>
                </SlideIn>
              </FadeIn>
            ))}
          </View>
        )}

        {/* Tips Section */}
        {savedItems.length > 0 && (
          <FadeIn delay={400}>
            <SlideIn direction="up" delay={400}>
              <View style={styles.tipsContainer}>
                <Ionicons name="information-circle" size={24} color="#667eea" />
                <Text style={styles.tipsText}>
                  Tap the bookmark icon to remove items from your saved list
                </Text>
              </View>
            </SlideIn>
          </FadeIn>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Saved

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    paddingTop: 70,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  savedItemsContainer: {
    marginBottom: 20,
  },
  savedItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  savedItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  savedItemContent: {
    flex: 1,
  },
  savedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  savedItemCategory: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  unsaveButton: {
    padding: 8,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
})
