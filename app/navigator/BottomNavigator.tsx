import React, {  } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '@/app/theme/color';

import Home from '@/app/screens/Home/Home';

const Tab = createBottomTabNavigator();

export default function MyTabs() {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 70, backgroundColor: '#FFFFFF', borderTopColor: Colors.bord, paddingTop: 12 },
        tabBarShowLabel: false,

      }}>

      <Tab.Screen name="Home" component={Home}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => {
            return <Image source={focused ? require('../../assets/image/t1f.png') : require('../../assets/image/t1.png')} resizeMode='stretch'
              style={{ height: 26, width: 26, marginTop: 5 }} />
          },

          headerShown: false,
        }}
      />


    </Tab.Navigator>
  );
}


