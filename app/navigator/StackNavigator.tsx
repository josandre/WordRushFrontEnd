import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@/app/screens/Login/Login";
import Option from "@/app/screens/Login/Option";
import Splash from "@/app/screens/Splash";
import Introduction from "@/app/screens/Introduction/Introduction";
import Signup from "@/app/screens/Login/Signup";
import MyTabs from "@/app/navigator/BottomNavigator";
import Profile from "@/app/screens/UserProfile/Profile";
import SettingScreen from "@/app/screens/UserProfile/SettingScreen";
import UpdateProfile from "@/app/screens/UserProfile/UpdateProfile";
import { Platform } from "react-native";

const Stack = createNativeStackNavigator();
const isWeb = Platform.OS === "web";

export default function StackNavigator() {
  const [showSplashScreen, setshowSplashScreen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setshowSplashScreen(false);
    }, 4000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showSplashScreen ? (
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
        ) : null}

        {!isWeb ? (
          <Stack.Screen
            name="Option"
            component={Option}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Introduction"
            component={Introduction}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
        {!isWeb && (
          <Stack.Screen
            name="Option"
            component={Option}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
