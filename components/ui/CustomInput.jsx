import React from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  error,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color={isFocused ? '#007bff' : '#999'} />
          </View>
        )}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
          >
            <Ionicons name={rightIcon} size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: '#007bff',
    backgroundColor: '#fff',
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#dc3545',
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 14,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  rightIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
    marginLeft: 4,
  },
})

