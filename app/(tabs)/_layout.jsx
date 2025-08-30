import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: 'lightblue',
        },
        headerTitleStyle:{
          fontWeight: 'bold',
          color: 'blue',
          fontSize: 20,
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        tabBarStyle: {
          position: 'absolute',
          // bottom: 14,
          left: 26,
          right: 26,
          height: 70,
          backgroundColor: '#ffffff',
          borderRadius: 35,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 8,
          borderTopWidth: 0,
          paddingHorizontal: 8,
          paddingVertical: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '600',
          marginTop: 0,
        },
        tabBarActiveTintColor: '#1ef4d7',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={focused ? 30 : 26} 
              name="home" 
              color={color} 
            />
          ),
        }} 
      />
       <Tabs.Screen 
        name="MapScreen" 
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={focused ? 30 : 26} 
              name="map" 
              color={color} 
            />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="Camera" 
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={focused ? 30 : 26} 
              name="camera" 
              color={color} 
            />
          ),
        }} 
      />
     
      <Tabs.Screen 
        name="Saved" 
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={focused ? 30 : 26} 
              name="save" 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={focused ? 30 : 26} 
              name="gear" 
              color={color} 
            />
          ),
        }} 
      />
    </Tabs>
  )
}

export default _layout