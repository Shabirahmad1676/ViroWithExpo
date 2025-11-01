import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const Pulse = ({ 
  children, 
  duration = 1000,
  minScale = 0.95,
  maxScale = 1.05,
  style 
}) => {
  const scaleAnim = useRef(new Animated.Value(minScale)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: maxScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: minScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    )
    pulse.start()
    
    return () => pulse.stop()
  }, [])

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

