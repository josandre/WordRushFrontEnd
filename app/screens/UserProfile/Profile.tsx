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

import useProfileUser from "./services/useProfileUser";
import ProfileHeader from "../../components/molecules/ProfileHeader";
import RankSection from "../../components/molecules/RankSection";
import ProfileTabs from "../../components/organisms/ProfileTabs";

import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
const avatars: any = {
  t4: require("../../../assets/image/t4.png"),
  a5: require("../../../assets/image/a5.png"),
  a6: require("../../../assets/image/a6.png"),
  a12: require("../../../assets/image/a12.png"),
  a14: require("../../../assets/image/a14.png"),
  a16: require("../../../assets/image/a16.png"),
  a18: require("../../../assets/image/a18.png"),
  a19: require("../../../assets/image/a19.png"),
  a20: require("../../../assets/image/a20.png"),
  a21: require("../../../assets/image/a21.png"),
  a22: require("../../../assets/image/a22.png"),
  a23: require("../../../assets/image/a23.png"),
  a24: require("../../../assets/image/a24.png"),
  a27: require("../../../assets/image/a27.png"),
  a28: require("../../../assets/image/a28.png"),
  a29: require("../../../assets/image/a29.png"),
  s1: require("../../../assets/image/s1.png"),
  s4: require("../../../assets/image/s4.png"),
  s5: require("../../../assets/image/s5.png"),
  s12: require("../../../assets/image/s12.png"),
  s13: require("../../../assets/image/s13.png"),
  s24: require("../../../assets/image/s24.png"),
  s25: require("../../../assets/image/s25.png"),
  s26: require("../../../assets/image/s26.png"),
  s27: require("../../../assets/image/s27.png"),
  s47: require("../../../assets/image/s47.png"),
};

export default function Profile() {
  const navigation = useNavigation<AppNavigation>();
  const { getProfileUser, data } = useProfileUser();

  React.useEffect(() => {
    getProfileUser({ userEmail: "taylor@gmail.com" });
  }, []);

  const user = data;
  const avatarSource = avatars[user?.avatar] || avatars["t4"];

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
