import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "@/app/theme/color";

import Admin from "@/app/screens/Admin/Admin";
import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
import { isWeb } from "@/app/utils/envDetails";

import Home from "@/app/screens/Home/Home";
import Profile from "@/app/screens/UserProfile/Profile";

const Tab = createBottomTabNavigator();

import homeIcon from "@/assets/image/t1.png";
import homeIconFocused from "@/assets/image/t1f.png";
import profileIcon from "@/assets/image/t4.png";
import profileIconFocused from "@/assets/image/t4f.png";
import adminIcon from "@/assets/image/t5.png";
import adminIconFocused from "@/assets/image/t5f.png";

export default function MyTabs() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const manager = isWeb
          ? ProfileWebTokenManager
          : ProfileMobileTokenManager;
        const profile = await manager.getUserProfile();
        if (
          profile &&
          typeof profile.roleId === "number" &&
          profile.roleId === 2
        ) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to determine user role", error);
      }
    }

    checkRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 70,
          backgroundColor: "#FFFFFF",
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
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={Admin}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? adminIconFocused : adminIcon}
                resizeMode="stretch"
                style={{ height: 26, width: 26, marginTop: 5 }}
              />
            ),
            headerShown: false,
          }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? profileIconFocused : profileIcon}
              resizeMode="stretch"
              style={{ height: 26, width: 26, marginTop: 5 }}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
