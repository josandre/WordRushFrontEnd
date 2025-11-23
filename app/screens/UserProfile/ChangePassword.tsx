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
import Icon from "react-native-vector-icons/Ionicons";
import { AppBar, Snackbar } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import ResetPasswordForm from "../../components/organisms/ResetPasswordForm";
import resetPasswordStyles from "../Auth/ResetPassword/ResetPasswordStyles";
import { AppNavigation } from "../../navigator/AppNavigationTypes";
import useResetPassword, {
  ResetPasswordPayload,
} from "../Auth/ResetPassword/services/userResetPassword";
import styles, {
  ERROR_SNACKBAR_COLOR,
  SUCCESS_SNACKBAR_COLOR,
} from "../Auth/styles";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";

export default function ChangePassword(): React.JSX.Element {
  const navigation = useNavigation<AppNavigation>();
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });
  const { resetPassword, loading } = useResetPassword();

  const handlePasswordReset = async (data: ResetPasswordPayload) => {
    const payload = {
      email: data.email,
      newPassword: data.newPassword,
    };

    const result = await resetPassword(payload);

    if (result.success) {
      const successSnackBar: SnackBarProps = {
        visible: true,
        message: result.data?.Message || "Password changed",
        color: SUCCESS_SNACKBAR_COLOR,
      };
      setSnackbar(successSnackBar);
      navigation.goBack();
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
    <SafeAreaView style={[style.area, resetPasswordStyles.container]}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <KeyboardAvoidingView
        style={resetPasswordStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[style.main, resetPasswordStyles.main]}>
          <AppBar
            title="Reset Password"
            titleStyle={[style.apptitle, resetPasswordStyles.appTitle]}
            centerTitle={true}
            style={resetPasswordStyles.appBar}
            elevation={0}
            leading={
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={resetPasswordStyles.backButton}
              >
                <Icon name="arrow-back" size={24} color={Colors.active} />
              </TouchableOpacity>
            }
          />

          <ResetPasswordForm onSubmit={handlePasswordReset} loading={loading} />

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
