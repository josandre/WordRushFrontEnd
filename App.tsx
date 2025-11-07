import "react-native-gesture-handler";
import React from "react";
import { Platform } from "react-native";
import StackNavigator from "@/app/navigator/StackNavigator";
import { FeatureFlagsProvider } from "./app/providers/FeatureFlagsProvider";
import { isWeb } from "./app/utils/envDetails";

if (isWeb) {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

export default function App() {
  return (
    <FeatureFlagsProvider>
      <StackNavigator />
    </FeatureFlagsProvider>
  );
}
