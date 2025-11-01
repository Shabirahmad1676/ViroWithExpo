import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const SlideIn = ({ 
  children, 
  direction = 'up', 
  duration = 600,
  delay = 0,
  distance = 50,
  style 
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      delay: delay,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }, [])

  const getTranslate = () => {
    switch (direction) {
      case 'up':
        return { translateY: slideAnim }
      case 'down':
        return { translateY: slideAnim }
      case 'left':
        return { translateX: slideAnim }
      case 'right':
        return { translateX: slideAnim }
      default:
        return { translateY: slideAnim }
    }
  }

  return (
    <Animated.View
      style={[
        {
          transform: [getTranslate()],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

