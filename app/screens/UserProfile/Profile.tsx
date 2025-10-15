import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
} from "react-native";
import { AppBar } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import avatars, { getAvatarImage } from "@/assets/avatars";
import useProfileUser, { ProfileUserResponse } from "./services/useProfileUser";
import ProfileHeader from "../../components/molecules/ProfileHeader";
import SettingsHeader from "../../components/organisms/SettingsHeader";
import SettingsList from "../../components/organisms/SettingsList";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileWebTokenManager from "@/app/TokenManagers/web/ProfileWebTokenManager";
import ProfileMobileTokenManager from "@/app/TokenManagers/mobile/ProfileMobileTokenManager";

const Tab = createMaterialTopTabNavigator();
const isWeb = Platform.OS === "web";
export default function Profile() {
  const navigation = useNavigation<AppNavigation>();
  const { getProfileUser, pdata } = useProfileUser();
  const [isEnabled, setIsEnabled] = useState(true);
  useEffect(() => {
    const loadProfile = async () => {
      const manager = isWeb
        ? ProfileWebTokenManager
        : ProfileMobileTokenManager;
      const userdata = await manager.getUserProfile();

      if (userdata?.email) {
        await getProfileUser({ userEmail: userdata.email });
      } else {
        console.log("No stored user email found!");
      }
    };
    loadProfile();
  }, [getProfileUser]);

  const avatarSource = getAvatarImage(pdata?.avatar) || avatars["default"];

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AppBar
          style={{
            backgroundColor: "transparent",
            marginHorizontal: 20,
            marginTop: Platform.OS === "ios" ? 10 : 30,
          }}
          elevation={0}
        />

        <SafeAreaView
          style={[
            style.main,
            {
              backgroundColor: Colors.secondary,
              marginTop: 50,
              marginHorizontal: 12,
              borderRadius: 30,
              paddingHorizontal: 15,
              marginBottom: 20,
              paddingBottom: 15,
            },
          ]}
        >
          <SettingsHeader />
          <ProfileHeader
            nickname={pdata?.nickname ?? "Guest"}
            avatar={avatarSource}
          />

          <SettingsList
            notificationEnabled={isEnabled}
            onToggleNotification={() => setIsEnabled(!isEnabled)}
            email={pdata?.email ?? ""}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Login", { fromRegisterSuccess: false })
            }
          >
            <Text
              style={[
                style.m16,
                {
                  color: "#EB5757",
                  textAlign: "center",
                  marginTop: 30,
                  marginBottom: 20,
                },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
