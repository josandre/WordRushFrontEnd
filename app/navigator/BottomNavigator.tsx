import React from 'react'
import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from '@/app/theme/color'

import Home from '@/app/screens/Home/Home'

const Tab = createBottomTabNavigator()

import homeIcon from '@/assets/image/t1.png'
import homeIconFocused from '@/assets/image/t1f.png'

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 70,
          backgroundColor: '#FFFFFF',
          borderTopColor: Colors.bord,
          paddingTop: 12,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? homeIconFocused : homeIcon}
              resizeMode="stretch"
              style={{ height: 26, width: 26, marginTop: 5 }}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  )
}
