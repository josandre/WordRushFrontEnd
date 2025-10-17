import React from "react";
import { View, Text, Switch } from "react-native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";

interface SettingsSwitchProps {
  label: string;
  value: boolean;
  onValueChange: () => void;
}

export default function SettingsSwitch({
  label,
  value,
  onValueChange,
}: SettingsSwitchProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
      }}
    >
      <Text style={[style.m16, { color: Colors.txt }]}>{label}</Text>
      <Switch
        trackColor={{ false: Colors.disable, true: Colors.primary }}
        thumbColor={value ? Colors.secondary : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}
