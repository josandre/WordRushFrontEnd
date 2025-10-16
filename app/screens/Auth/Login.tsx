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
import WebTokenManager from "@/app/TokenManagers/web/WebTokenManager";
import MobileTokenManager from "@/app/TokenManagers/mobile/MobileTokenManager";
import ProfileMobileTokenManager from "@/app/TokenManagers/mobile/ProfileMobileTokenManager";
import ProfileWebTokenManager from "@/app/TokenManagers/web/ProfileWebTokenManager";
import useProfileUser from "../../screens/UserProfile/services/useProfileUser";
import { isWeb } from "@/app/utils/envDetails";

async function saveProfile(profileData: ProfileUserResponse | undefined) {
  if (isWeb) {
    await ProfileWebTokenManager.saveProfile(profileData);
  } else {
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
      const user = await getProfileUser({ userEmail: form.email });

      // TODO create centralize object to avoid branching

      if (isWeb) {
        await ProfileWebTokenManager.clearProfile();
        await WebTokenManager.saveTokens(tokens);
        saveProfile(user.data);
      } else {
        await ProfileMobileTokenManager.clearProfile();
        await MobileTokenManager.saveTokens(tokens);
        saveProfile(user.data);
      }

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
