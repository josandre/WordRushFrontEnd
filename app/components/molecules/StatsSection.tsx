import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../theme/color";

const StatsSection = ({
  stats,
}: {
  stats?: { games: number; wins: number; losses: number; accuracy: number };
}) => {
  const data = stats || { games: 42, wins: 30, losses: 12, accuracy: 71 };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Stats</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Games Played:</Text>
        <Text style={styles.value}>{data.games}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Wins:</Text>
        <Text style={styles.value}>{data.wins}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Losses:</Text>
        <Text style={styles.value}>{data.losses}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Accuracy:</Text>
        <Text style={styles.value}>{data.accuracy}%</Text>
      </View>
    </View>
  );
};

export default StatsSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.txt,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    color: Colors.primary,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.txt,
  },
});
