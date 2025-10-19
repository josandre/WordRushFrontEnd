import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Auth/Login";
import Option from "../screens/Auth/Option";
import Splash from "../screens/Splash";
import Introduction from "../screens/Introduction/Introduction";
import Signup from "../screens/Auth/Signup";
import MyTabs from "./BottomNavigator";
import Profile from "@/app/screens/UserProfile/Profile";
import UpdateProfile from "@/app/screens/UserProfile/UpdateProfile";
import { isWeb } from "../utils/envDetails";
import ResetPassword from "../screens/Auth/ResetPassword/ResetPassword";
import ChangePassword from "../screens/UserProfile/ChangePassword";
import Home from "../screens/Home/Home";
import ConfigureLobby from "@/app/screens/Lobby/ConfigureLobby";
import JoinLobby from "@/app/screens/Lobby/JoinLobby";
import Lobby from "@/app/screens/Lobby/Lobby";

const Stack = createNativeStackNavigator();

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

        {isWeb ? (
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
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
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
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfigureLobby"
          component={ConfigureLobby}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="JoinLobby"
          component={JoinLobby}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Lobby"
          component={Lobby}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
