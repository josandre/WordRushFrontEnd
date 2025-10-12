import {
  View,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { AppBar } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { keyboardBehavior } from "../Login/helpers";
import UpdateForm from "@/app/components/organisms/UpdateForm";
import { SIGN_UP_TITLE } from "@/app/components/molecules/constants";
//import useRegisterUser, { RegisterPayload } from "./services/useRegisterUser";
import useProfileUser from "./services/useProfileUser";
import { Snackbar } from "@react-native-material/core";
import styles, {
  ERROR_SNACKBAR_COLOR,
  SUCCESS_SNACKBAR_COLOR,
} from "../Login/styles";
import { SnackBarProps } from "../Login/constants";
import avatars, { AvatarId, getAvatarImage } from "@/assets/avatars";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function UpdateProfile() {
  const navigation = useNavigation<AppNavigation>();
  const { getProfileUser, data } = useProfileUser();
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });
  React.useEffect(() => {
    getProfileUser({ userEmail: "taylor@gmail.com" });
  }, []);

  const user = data;
  const avatarSource = getAvatarImage(user?.avatar) || avatars["t4"];
  //   const handleSubmit = async (form: RegisterPayload) => {
  //     const payload = {
  //       userName: form.nickname,
  //       email: form.email,
  //       password: form.password,
  //       nickname: form.nickname,
  //       avatar: "",
  //     };
  //     const result = await register(payload);
  //     if (result.success) {
  //       const successSnackBar: SnackBarProps = {
  //         visible: true,
  //         message: result.data?.Message || "Registered",
  //         color: SUCCESS_SNACKBAR_COLOR,
  //       };

  //       setSnackbar(successSnackBar);
  //       navigation.navigate("Login", { fromRegisterSuccess: true });
  //     } else {
  //       const errorSnackBar: SnackBarProps = {
  //         visible: true,
  //         message: result.errorMessage,
  //         color: ERROR_SNACKBAR_COLOR,
  //       };
  //       setSnackbar(errorSnackBar);
  //     }
  //   };

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
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
            title={"Update Profile"}
            titleStyle={[style.apptitle, { color: Colors.txt }]}
            centerTitle={true}
            style={{ backgroundColor: "transparent" }}
            elevation={0}
          />

          <UpdateForm
            onLogin={() => navigation.navigate("Profile")}
            onSubmit={() => {
              setSnackbar({
                visible: true,
                message: "Profile Updated Successfully",
                color: SUCCESS_SNACKBAR_COLOR,
              });
            }}
          />

          {snackbar.visible && (
            <Snackbar
              message={
                snackbar.message ??
                "There was an error during the process, please try again"
              }
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
