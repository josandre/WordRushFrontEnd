import React from "react";
import { Text, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";

export default function AdminLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.txt,
  },
});
