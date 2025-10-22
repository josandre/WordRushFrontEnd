import { StatusBar, ScrollView } from "react-native";
import React from "react";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import IntroSlide from "../../components/organisms/IntroSlide";
import { INTRO_BG, FIRST_SLICE_TITLE, SECOND_SLICE_TITLE } from "./constants";
import { isWeb } from "@/app/utils/envDetails";

export default function Introduction() {
  const navigation = useNavigation<AppNavigation>();

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        style={isWeb ? { pointerEvents: "auto" } : {}}
      >
        <IntroSlide
          background={INTRO_BG}
          dotsTotal={2}
          dotsActiveIndex={0}
          ctaTitle={FIRST_SLICE_TITLE}
          onSignUp={() => navigation.navigate("Option")}
          onLogin={() => navigation.navigate("Option")}
          imageHeightRatio={3}
        />
        <IntroSlide
          background={INTRO_BG}
          dotsTotal={2}
          dotsActiveIndex={1}
          ctaTitle={SECOND_SLICE_TITLE}
          onSignUp={() => navigation.navigate("Option")}
          onLogin={() => navigation.navigate("Option")}
          imageHeightRatio={3}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
