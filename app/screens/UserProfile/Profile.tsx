import React, { useEffect } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { AppBar } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import Icon from "react-native-vector-icons/Ionicons";
import avatars, { getAvatarImage } from "@/assets/avatars";
import useProfileUser from "./services/useProfileUser";
import ProfileHeader from "../../components/molecules/ProfileHeader";
import RankSection from "../../components/molecules/RankSection";
import ProfileTabs from "../../components/organisms/ProfileTabs";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileWebTokenManager from "@/app/TokenManagers/web/ProfileWebTokenManager";
import ProfileMobileTokenManager from "@/app/TokenManagers/mobile/ProfileMobileTokenManager";

const Tab = createMaterialTopTabNavigator();
const isWeb = Platform.OS === "web";

export default function Profile() {
  const navigation = useNavigation<AppNavigation>();
  const { getProfileUser, pdata } = useProfileUser();

  useEffect(() => {
    // Load stored user data and then fetch profile
    const loadUserWebProfile = async () => {
      const userdata = await ProfileWebTokenManager.getUserProfile();

      if (userdata?.email) {
        await getProfileUser({ userEmail: userdata.email });
      } else {
        console.warn("No stored user email found!");
      }
    };
    const loadUserMobileProfile = async () => {
      const userdata = await ProfileMobileTokenManager.getUserProfile();

      if (userdata?.email) {
        await getProfileUser({ userEmail: userdata.email });
      } else {
        console.warn("No stored user email found!");
      }
    };

    if (isWeb) loadUserWebProfile();
    else loadUserMobileProfile();
  }, []);

  const user = pdata;
  const avatarSource = getAvatarImage(user?.avatar) || avatars["t4f"];

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
          trailing={
            <Icon
              name="settings-sharp"
              size={24}
              color={Colors.secondary}
              onPress={() => navigation.navigate("SettingScreen")}
            />
          }
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
          <ProfileHeader
            avatar={avatarSource}
            nickname={user?.nickname ?? "Guest"}
            email={user?.email ?? "No email"}
          />
          <RankSection />
          <ProfileTabs />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
