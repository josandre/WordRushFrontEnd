import { Dimensions, StatusBar, ImageBackground, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import style from "../theme/style";
import { Colors } from "../theme/color";
import bgImage from "@/assets/image/bg.png";
import logo from "@/assets/image/Logo.png";
import { SafeAreaView } from "react-native-safe-area-context";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function Splash() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={"light-content"}
      />
      <ImageBackground
        source={bgImage}
        resizeMode="stretch"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={logo}
          resizeMode="stretch"
          style={{ height: 166, width: 140 }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
