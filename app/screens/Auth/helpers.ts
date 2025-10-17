import { Platform } from "react-native";

export const keyboardBehavior = () => Platform.OS === 'ios' ? 'padding' : 'height'