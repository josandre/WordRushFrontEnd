import { isWeb } from "@/app/utils/envDetails";
import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("screen");
const { width: windowWidth } = Dimensions.get("window");
const width = isWeb ? windowWidth : screenWidth;

const isDesktop = width > 1024;
const maxContentWidth = isWeb && isDesktop ? 800 : width;

export default StyleSheet.create({
  slide: {
    width: maxContentWidth,
    ...(isWeb && {
      maxWidth: maxContentWidth,
      alignSelf: "center",
    }),
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    ...(isWeb && {
      minHeight: isDesktop ? 400 : 300,
    }),
  },
  image: {
    width: maxContentWidth - 40,
    alignSelf: "center",
    ...(isWeb && {
      maxWidth: isDesktop ? 500 : 350,
      height: "auto",
    }),
  },
});
