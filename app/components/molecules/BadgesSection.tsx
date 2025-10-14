import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../../theme/color";
import a31 from "../../../assets/image/a31.png";
import a32 from "../../../assets/image/a32.png";
import a33 from "../../../assets/image/a33.png";
import a34 from "../../../assets/image/a34.png";
import a35 from "../../../assets/image/a35.png";
import a36 from "../../../assets/image/a36.png";
const badges1 = [
  { id: 1, name: "1", icon: a31 },
  { id: 2, name: "2", icon: a32 },
  { id: 3, name: "3", icon: a33 },
];
const badges2 = [
  { id: 4, name: "4", icon: a34 },
  { id: 5, name: "5", icon: a35 },
  { id: 6, name: "6", icon: a36 },
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
