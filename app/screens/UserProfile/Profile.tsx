import React from "react";
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
import avatars, { AvatarId, getAvatarImage } from "@/assets/avatars";
import useProfileUser from "./services/useProfileUser";
import ProfileHeader from "../../components/molecules/ProfileHeader";
import RankSection from "../../components/molecules/RankSection";
import ProfileTabs from "../../components/organisms/ProfileTabs";

import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  const navigation = useNavigation<AppNavigation>();
  const { getProfileUser, data } = useProfileUser();

  React.useEffect(() => {
    getProfileUser({ userEmail: "taylor@gmail.com" });
  }, []);

  const user = data;
  const avatarSource = getAvatarImage(user?.avatar) || avatars["t4"];
  //avatars[user?.avatar as AvatarId]
  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent={true}
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
            nickname={user?.nickname}
            email={user?.email}
          />
          <RankSection />
          <ProfileTabs />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
