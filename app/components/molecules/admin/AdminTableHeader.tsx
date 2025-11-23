import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";

export default function AdminTableHeader() {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
      <Text style={[styles.headerCell, styles.cellLarge]}>Nickname</Text>
      <Text style={[styles.headerCell, styles.cellLarge]}>Email</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Role</Text>
      <Text style={[styles.headerCell, styles.cellMedium]}>Created</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Played</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Wins</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Score</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: Colors.bg1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bord,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.txt,
  },
  cellId: { width: 40 },
  cellSmall: { width: 60 },
  cellMedium: { width: 90 },
  cellLarge: { flex: 1 },
});
