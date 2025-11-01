import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const FadeIn = ({ 
  children, 
  duration = 500, 
  delay = 0,
  style,
  fromOpacity = 0,
  toOpacity = 1 
}) => {
  const fadeAnim = useRef(new Animated.Value(fromOpacity)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: toOpacity,
      duration: duration,
      delay: delay,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

