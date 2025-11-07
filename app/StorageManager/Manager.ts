import { Platform, Platform as RNPlatform } from "react-native";

export default class Manager {
  isWebPlatform = (): boolean => {
    return Platform.OS === "web";
  };
}
