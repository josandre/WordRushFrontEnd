import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import EmailField from "../molecules/InputField";
import PasswordField from "../molecules/PasswordField";
import PrimaryButton from "../atoms/PrimaryButton";
import { SnackBarProps } from "@/app/screens/Auth/constants";
import { RouteProp, useRoute } from "@react-navigation/native";
import styles, { SUCCESS_SNACKBAR_COLOR } from "@/app/screens/Auth/styles";
import { AppRoutes } from "@/app/navigator/AppNavigationTypes";
import { Snackbar } from "@react-native-material/core";
import TermsNotice from "../molecules/TermsNotice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SNACKBAR_MESSAGES } from "./constants";
import { LogInPayload } from "@/app/screens/Auth/services/useLogIn";

type LoginRouteProp = RouteProp<AppRoutes, "Login">;

type Props = {
  onLogin: (form: LogInPayload) => void;
  onForgot: () => void;
  loading: boolean;
};

export default function LoginForm({
  onLogin,
  onForgot,
  loading = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });
  const route = useRoute<LoginRouteProp>();
  const fromRegisterSuccess = route.params?.fromRegisterSuccess;
  const insets = useSafeAreaInsets();
  const isNonEmpty = (val: string) => val.trim().length > 0;
  const isFormValid = isNonEmpty(email) && isNonEmpty(password);

  useEffect(() => {
    if (fromRegisterSuccess) {
      const welcomeSnackBar: SnackBarProps = {
        visible: true,
        message: SNACKBAR_MESSAGES.WelcomeMessage,
        color: SUCCESS_SNACKBAR_COLOR,
      };

      setSnackbar(welcomeSnackBar);
    }
  }, [fromRegisterSuccess]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <EmailField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          visible={isPasswordVisible}
          onToggleVisible={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        <PrimaryButton
          title="Login"
          onPress={() => onLogin({ email, password })}
          disabled={!isFormValid || loading}
          loading={loading}
        />

        {/* TODO: Implement forgot password feature */}
        <PrimaryButton title="Forgot password?" onPress={onForgot} />

        <TermsNotice />
      </ScrollView>

      {snackbar.visible && (
        <Snackbar
          message={snackbar.message ?? SNACKBAR_MESSAGES.DefaultRegisterSuccess}
          style={[
            styles.snackbarContainer,
            { backgroundColor: snackbar.color, bottom: insets.bottom + 16 },
          ]}
        />
      )}
    </View>
  );
}
