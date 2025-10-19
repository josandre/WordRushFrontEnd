import {
  View,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import OptionCard from "../../components/organisms/OptionCard";
import { HELPER_TEXT, IMAGE_BG, IMAGE_BG_WITH_LOGO, TITLE } from "./constants";
import optionStyles from "./styles";
import { keyboardBehavior } from "./helpers";
import { isWeb } from "@/app/utils/envDetails";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function Option() {
  const navigation = useNavigation<AppNavigation>();

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
      <ImageBackground
        source={IMAGE_BG_WITH_LOGO}
        resizeMode="stretch"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ImageBackground
          source={isWeb ? IMAGE_BG : IMAGE_BG_WITH_LOGO}
          resizeMode={isWeb ? "contain" : "cover"}
          style={[optionStyles.backgroundImage, isWeb && { width, height }]}
        >
          <StatusBar
            backgroundColor="transparent"
            translucent={true}
            barStyle={"dark-content"}
          />
          <KeyboardAvoidingView
            style={optionStyles.keyboardAvoiding}
            behavior={keyboardBehavior()}
          >
            <View style={optionStyles.contentWrapper}>
              <OptionCard
                title={TITLE}
                subtitle={HELPER_TEXT}
                onLogin={() =>
                  navigation.navigate("Login", { fromRegisterSuccess: false })
                }
                onSignup={() => navigation.navigate("Signup")}
              />
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </ImageBackground>
    </SafeAreaView>
  );
}
