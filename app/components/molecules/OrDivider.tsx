import React from "react";
import { View, Text } from "react-native";
import mstyles from "./styles";
import { Colors } from "../../theme/color";

export default function OrDivider() {
  return (
    <View style={mstyles.orRow}>
      <View style={[mstyles.orDivider, { backgroundColor: Colors.btn }]} />
      <Text style={[mstyles.orText, { color: Colors.disable }]}>OR</Text>
      <View style={[mstyles.orDivider, { backgroundColor: Colors.btn }]} />
    </View>
  );
}

