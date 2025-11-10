import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { AppBar } from "@react-native-material/core";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import avatars, { getAvatarImage } from "@/assets/avatars";
import useProfileUser from "./services/useProfileUser";
import ProfileHeader from "../../components/molecules/ProfileHeader";
import SettingsHeader from "../../components/organisms/SettingsHeader";
import SettingsList from "../../components/organisms/SettingsList";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";
import WordRushSpinner from "@/app/components/atoms/WordRushSpinner";

const isWeb = Platform.OS === "web";

export default function Profile() {
  const navigation = useNavigation<AppNavigation>();
  const { getProfileUser, pdata } = useProfileUser();
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        setLoading(true);
        const manager = isWeb
          ? ProfileWebTokenManager
          : ProfileMobileTokenManager;
        const userdata = await manager.getUserProfile();

        if (userdata?.email) {
          await getProfileUser({ userEmail: userdata.email });
        }
        setLoading(false);
      };

      loadProfile();
    }, [getProfileUser]),
  );

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

        {loading ? (
          <View style={styles.loaderContainer}>
            <View style={styles.loaderBox}>
              <WordRushSpinner text="Loading..." textColor="#000" size={100} />
              <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
          </View>
        ) : (
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
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    //backgroundColor: "rgba(0, 0, 0, 0)", // dim background
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "#fffffff2",
    padding: 25,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "800",
  },
});
