import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";

type Props = { text: string };

export default function AdminBadge({ text }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: Colors.bg1,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.txt,
    fontWeight: "600",
  },
});
