import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

// Used to return a value in pixels from a percentage based on the device's screen width
export const widthPercentage = (percent: number) => (width * percent) / 100;

// Used to return a value in pixels from a percentage based on the device's screen height
export const heightPercentage = (percent: number) => (height * percent) / 100;
