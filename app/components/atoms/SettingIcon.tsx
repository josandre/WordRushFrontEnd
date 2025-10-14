import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../theme/color";

interface SettingIconProps {
  name: string;
  type?: "Ionicons" | "Material";
  size?: number;
}

export default function SettingIcon({
  name,
  type = "Ionicons",
  size = 24,
}: SettingIconProps) {
  const IconComponent = type === "Material" ? Icons : Icon;

  return (
    <View
      style={{
        height: 44,
        width: 44,
        backgroundColor: Colors.secondary,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconComponent name={name} size={size} color={Colors.primary} />
    </View>
  );
}
