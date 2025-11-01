import React from 'react'
import { View } from 'react-native'
import { FadeIn } from './FadeIn'
import { SlideIn } from './SlideIn'

export const StaggerContainer = ({ 
  children, 
  staggerDelay = 100,
  direction = 'up',
  style 
}) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>
          <SlideIn direction={direction} delay={index * staggerDelay}>
            {child}
          </SlideIn>
        </FadeIn>
      ))}
    </View>
  )
}

