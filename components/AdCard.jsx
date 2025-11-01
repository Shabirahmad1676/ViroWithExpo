import React, { useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FadeIn } from './animations'

const { width } = Dimensions.get('window')

export const AdCard = ({ ad, onPress, onSave }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const liked = useRef(false)

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 3,
      tension: 300,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 300,
    }).start()
  }

  const handleLike = () => {
    liked.current = !liked.current
    onSave && onSave(ad)
  }

  return (
    <FadeIn delay={0}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress && onPress(ad)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image source={ad.image} style={styles.image} />
            {ad.discount && (
              <View style={styles.discountBadge}>
                <Ionicons name="pricetag" size={14} color="#fff" />
                <Text style={styles.discountText}>{ad.discount}</Text>
              </View>
            )}
            {ad.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{ad.category}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.likeButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Ionicons
                name={liked.current ? 'heart' : 'heart-outline'}
                size={24}
                color={liked.current ? '#ff4757' : '#fff'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={2}>
                {ad.title}
              </Text>
              {ad.rating && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{ad.rating}</Text>
                </View>
              )}
            </View>

            {ad.business && (
              <View style={styles.businessContainer}>
                <Ionicons name="business" size={16} color="#667eea" />
                <Text style={styles.businessName}>{ad.business}</Text>
              </View>
            )}

            {ad.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {ad.location}
                </Text>
              </View>
            )}

            {ad.description && (
              <Text style={styles.description} numberOfLines={2}>
                {ad.description}
              </Text>
            )}

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => onPress && onPress(ad)}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </FadeIn>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 220,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ff4757',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 8,
    backdropFilter: 'blur(10)',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#856404',
    marginLeft: 4,
  },
  businessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  },
})

