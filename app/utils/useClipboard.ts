import { useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import { Alert, Platform } from "react-native";

export function useClipboard() {
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (!text) {
        Alert.alert("Nothing to copy");
        return;
      }

      await Clipboard.setStringAsync(text);

      if (Platform.OS === "web") {
        Alert.alert("Copied!", `Copied: ${text}`);
      } else {
        Alert.alert("Copied", "Copied to clipboard successfully!");
      }
    } catch (error) {
      console.error("Clipboard error:", error);
      Alert.alert("Error", "Could not copy text to clipboard.");
    }
  }, []);

  const getClipboardText = useCallback(async (): Promise<string> => {
    try {
      const text = await Clipboard.getStringAsync();
      return text || "";
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      return "";
    }
  }, []);

  return { copyToClipboard, getClipboardText };
}
