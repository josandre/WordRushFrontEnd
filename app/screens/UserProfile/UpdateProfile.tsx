import React, { useCallback, useState } from "react";
import { View, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar, Snackbar } from "@react-native-material/core";
import Icon from "react-native-vector-icons/Ionicons";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { keyboardBehavior } from "../Auth/helpers";
import UpdateForm from "@/app/components/organisms/UpdateForm";
import styles, { SUCCESS_SNACKBAR_COLOR } from "../Auth/styles";
import { SnackBarProps } from "../Auth/constants";
import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import avatars, { AvatarId } from "@/assets/avatars";
import useProfileUser from "./services/useProfileUser";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";

export default function UpdateProfile() {
  const navigation = useNavigation<AppNavigation>();
  const { pdata, getProfileUser, updateProfile, updateProfileAPI } =
    useProfileUser();
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
    color: SUCCESS_SNACKBAR_COLOR,
  });

  const isWeb = Platform.OS === "web";

  async function saveProfile(profileData: ProfileUserResponse | undefined) {
    if (isWeb) {
      await ProfileWebTokenManager.clearProfile();
      await ProfileWebTokenManager.saveProfile(profileData);
    } else {
      await ProfileMobileTokenManager.clearProfile();
      await ProfileMobileTokenManager.saveProfile(profileData);
    }
  }

  // Load user profile when screen gains focus
  useFocusEffect(
    useCallback(() => {
      const loadUserProfile = async () => {
        const userdata = await (isWeb
          ? ProfileWebTokenManager.getUserProfile()
          : ProfileMobileTokenManager.getUserProfile());

        if (userdata?.email) {
          const user = await getProfileUser({ userEmail: userdata.email });
          await saveProfile(user.data);
        } else {
          console.warn("No stored user email found!");
        }
      };

      loadUserProfile();
    }, [isWeb, getProfileUser]),
  );

  const handleSuccess = (message: string) => {
    setSnackbar({ visible: true, message, color: SUCCESS_SNACKBAR_COLOR });
    setTimeout(
      () => setSnackbar((prev) => ({ ...prev, visible: false })),
      2000,
    );
  };

  // Preselect avatar safely
  const avatar: AvatarId =
    pdata?.avatar && Object.keys(avatars).includes(pdata.avatar)
      ? (pdata.avatar as AvatarId)
      : "default";

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior()}>
        <View
          style={[
            style.main,
            {
              backgroundColor: Colors.bord,
              marginTop: Platform.OS === "ios" ? 10 : 30,
            },
          ]}
        >
          <AppBar
            title="Update Profile"
            titleStyle={[style.apptitle, { color: Colors.txt }]}
            centerTitle
            style={{ backgroundColor: "transparent" }}
            elevation={0}
            leading={
              <Icon
                name="arrow-back"
                size={24}
                color={Colors.txt}
                onPress={() => navigation.goBack()}
              />
            }
          />

          <UpdateForm
            user={pdata}
            avatar={avatar}
            onSubmit={async (updated) => {
              updateProfile(updated);
              const result = await updateProfileAPI(updated);

              if (result.success) {
                // Save the new profile locally so Lobby/Home reflect instantly
                await saveProfile(result.data);
                handleSuccess("Profile Updated Successfully");
                setTimeout(() => navigation.goBack(), 800);
              } else {
                console.warn(result.errorMessage);
              }
            }}
            onLogin={() => navigation.goBack()}
          />

          {snackbar.visible && (
            <Snackbar
              message={snackbar.message ?? "An unexpected error occurred"}
              style={[
                styles.snackbarContainer,
                { backgroundColor: snackbar.color },
              ]}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
