import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { AppBar, Snackbar } from "@react-native-material/core";
import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import LoginForm from "../../components/organisms/LoginForm";
import useLogIn, { LogInPayload } from "./services/useLogIn";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "./constants";
import styles, { ERROR_SNACKBAR_COLOR } from "./styles";
import WebTokenManager from "@/app/StorageManager/TokenManagers/web/WebTokenManager";
import MobileTokenManager from "@/app/StorageManager/TokenManagers/mobile/MobileTokenManager";
import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
import useProfileUser from "../../screens/UserProfile/services/useProfileUser";
import { isWeb } from "@/app/utils/envDetails";

async function saveProfile(profileData: ProfileUserResponse | undefined) {
  if (isWeb) {
    await ProfileWebTokenManager.clearProfile();
    await ProfileWebTokenManager.saveProfile(profileData);
  } else {
    await ProfileMobileTokenManager.clearProfile();
    await ProfileMobileTokenManager.saveProfile(profileData);
  }
}
export default function Login() {
  const navigation = useNavigation<AppNavigation>();
  const { logIn, loading, error, data } = useLogIn();
  const { getProfileUser } = useProfileUser();
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  const handleSubmit = async (form: LogInPayload) => {
    const payload = {
      email: form.email,
      password: form.password,
    };

    const result = await logIn(payload);

    if (result.success) {
      const tokens = result.data;

      // TODO create centralize object to avoid branching

      // SAVE THE NEW TOKEN
      if (isWeb) {
        await WebTokenManager.saveTokens(tokens);
      } else {
        await MobileTokenManager.saveTokens(tokens);
      }

      const user = await getProfileUser({ userEmail: form.email });
      await saveProfile(user.data);
      navigation.navigate("MyTabs");
    } else {
      const errorSnackBar: SnackBarProps = {
        visible: true,
        message: result.errorMessage,
        color: ERROR_SNACKBAR_COLOR,
      };
      setSnackbar(errorSnackBar);
    }
  };

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            title="Login"
            titleStyle={[style.apptitle, { color: Colors.txt }]}
            centerTitle={true}
            style={{ backgroundColor: "transparent" }}
            elevation={0}
            leading={
              <TouchableOpacity onPress={() => navigation.navigate("Option")} />
            }
          />
          <LoginForm
            onLogin={handleSubmit}
            onForgot={() => navigation.navigate("ResetPassword")}
            loading={loading}
          />

          {snackbar.visible && (
            <Snackbar
              message={snackbar.message ?? FALLBACK_ERROR_MESSAGE}
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
