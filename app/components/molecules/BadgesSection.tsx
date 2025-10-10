import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../../theme/color";

const badges1 = [
  { id: 1, name: "1", icon: require("../../../assets/image/a31.png") },
  { id: 2, name: "2", icon: require("../../../assets/image/a32.png") },
  { id: 3, name: "3", icon: require("../../../assets/image/a33.png") },
];
const badges2 = [
  { id: 4, name: "4", icon: require("../../../assets/image/a34.png") },
  { id: 5, name: "5", icon: require("../../../assets/image/a35.png") },
  { id: 6, name: "6", icon: require("../../../assets/image/a36.png") },
];

const BadgesSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Badges</Text>
      <View style={styles.badgeRow}>
        {badges1.map((badge) => (
          <View key={badge.id} style={styles.badgeCard}>
            <Image
              source={badge.icon}
              style={styles.badgeImage}
              resizeMode="stretch"
            />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      ></View>
      <View style={styles.badgeRow}>
        {badges2.map((badge) => (
          <View key={badge.id} style={styles.badgeCard}>
            <Image
              source={badge.icon}
              style={styles.badgeImage}
              resizeMode="stretch"
            />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BadgesSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.txt,
    marginBottom: 15,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badgeCard: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  badgeImage: {
    width: 60,
    height: 60,
  },
  badgeLabel: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.primary,
  },
});
