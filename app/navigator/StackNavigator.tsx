import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '@/app/screens/Login/Login';
import Option from '@/app/screens/Login/Option';
import Splash from '@/app/screens/Splash';
import Introduction from '@/app/screens/Introduction/Introduction';
import Reset from '@/app/screens/Login/Reset';
import NewPass from '@/app/screens/Login/NewPass';
import Signup from '@/app/screens/Login/Signup';
import Email from '@/app/screens/Login/Email';
import User from '@/app/screens/Login/User';
import Pass from '@/app/screens/Login/Pass';

import MyTabs from '@/app/navigator/BottomNavigator';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {

  const [showSplashScreen, setshowSplashScreen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setshowSplashScreen(false);
    }, 4000);


  }, [])

  return (

    <NavigationContainer>

      <Stack.Navigator>

        {
          showSplashScreen ?
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false }} />
            : null
        }

        <Stack.Screen
          name="Introduction"
          component={Introduction}
          options={{ headerShown: false }} />
          

        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="Pass"
          component={Pass}
          options={{ headerShown: false }} />

        <Stack.Screen
          name="User"
          component={User}
          options={{ headerShown: false }} />

        <Stack.Screen
          name="Email"
          component={Email}
          options={{ headerShown: false }} />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }} />

        <Stack.Screen
          name="NewPass"
          component={NewPass}
          options={{ headerShown: false }} />

        <Stack.Screen
          name="Reset"
          component={Reset}
          options={{ headerShown: false }} />

        <Stack.Screen
          name="Option"
          component={Option}
          options={{ headerShown: false }} />


        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>

  )
}