import React from "react";
import { View, Text } from "react-native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";

interface SettingTextBlockProps {
  title: string;
  subtitle?: string;
}

export default function SettingTextBlock({
  title,
  subtitle,
}: SettingTextBlockProps) {
  return (
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={[style.m16, { color: Colors.txt }]}>{title}</Text>
      {subtitle && (
        <Text style={[style.r14, { color: Colors.disable }]}>{subtitle}</Text>
      )}
    </View>
  );
}
