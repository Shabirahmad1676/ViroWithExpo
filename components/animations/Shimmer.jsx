import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'

export const Shimmer = ({ 
  children, 
  duration = 1500,
  style,
  shimmerColor = 'rgba(255, 255, 255, 0.3)',
  overlayColor = 'transparent'
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      })
    )
    shimmer.start()
    
    return () => shimmer.stop()
  }, [])

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  })

  return (
    <Animated.View style={[styles.container, style]}>
      {children}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            backgroundColor: shimmerColor,
          },
        ]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
})

