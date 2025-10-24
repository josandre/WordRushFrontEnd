// utils/wsConfig.ts
import { Platform } from "react-native";

export const WS_URL =
  Platform.OS === "android"
    ? "ws://10.0.2.2:5178/ws"
    : "ws://127.0.0.1:5178/ws";
