import React from "react";
import { Text, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";

export default function AdminMetaText({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Text style={styles.meta}>{children}</Text>;
}

const styles = StyleSheet.create({
  meta: {
    fontSize: 12,
    color: Colors.txt1,
  },
});
