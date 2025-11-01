import React, { useRef } from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, View } from 'react-native'

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    { transform: [{ scale: scaleAnim }] },
    style,
  ]

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ]

  const renderContent = () => (
    <>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={buttonTextStyle}>{title}</Text>
    </>
  )

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={buttonStyle}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#fff' : '#667eea'} />
        ) : (
          renderContent()
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primary: {
    backgroundColor: '#667eea',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#667eea',
  },
  outlineText: {
    color: '#667eea',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  iconWrapper: {
    marginRight: 8,
  },
})

