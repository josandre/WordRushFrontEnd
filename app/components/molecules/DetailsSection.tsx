import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../theme/color";

const matches = [
  {
    id: 1,
    opponent: "Beginner",
    result: "Win",
    score: "15 - 10",
    date: "2025-10-01",
  },
  {
    id: 2,
    opponent: "Advanced",
    result: "Loss",
    score: "9 - 15",
    date: "2025-09-28",
  },
  {
    id: 3,
    opponent: "Expert",
    result: "Win",
    score: "14 - 12",
    date: "2025-09-25",
  },
];

const DetailsSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Matches</Text>
      {matches.map((m) => (
        <View key={m.id} style={styles.matchCard}>
          <View style={styles.row}>
            <Text style={styles.label}>{m.opponent}</Text>
            <Text
              style={[
                styles.result,
                m.result === "Win" ? styles.win : styles.loss,
              ]}
            >
              {m.result}
            </Text>
          </View>
          <Text style={styles.details}>
            {m.score} • {m.date}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default DetailsSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.txt,
    marginBottom: 10,
  },
  matchCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 15,
    color: Colors.primary,
  },
  result: {
    fontWeight: "bold",
  },
  win: {
    color: "#00FF88",
  },
  loss: {
    color: "#FF5555",
  },
  details: {
    marginTop: 5,
    color: Colors.txt1,
    fontSize: 13,
  },
});
