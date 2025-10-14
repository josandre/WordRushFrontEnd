import React from "react";
import { View } from "react-native";
import StatItem from "../atoms/StatItem";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import a30 from "../../../assets/image/a30.png";

export default function RankSection() {
  return (
    <View
      style={{
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 15,
      }}
    >
      <StatItem icon="star-outline" label="POINTS" value="590" />
      <View
        style={[
          style.verticaldivider,
          { backgroundColor: "#FFFFFF50", height: 60 },
        ]}
      />
      <StatItem icon="globe-outline" label="WORLD RANK" value="#1,438" />
      <View
        style={[
          style.verticaldivider,
          { backgroundColor: "#FFFFFF50", height: 60 },
        ]}
      />
      <StatItem image={a30} label="LOCAL RANK" value="590" />
    </View>
  );
}
