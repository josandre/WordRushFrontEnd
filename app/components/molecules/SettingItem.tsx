import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../theme/color";
import SettingIcon from "../atoms/SettingIcon";
import SettingTextBlock from "../atoms/SettingTextBlock";

interface SettingItemProps {
  icon: string;
  iconType?: "Ionicons" | "Material";
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function SettingItem({
  icon,
  iconType,
  title,
  subtitle,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.bord,
        borderRadius: 16,
        padding: 15,
        marginTop: 15,
      }}
    >
      <SettingIcon name={icon} type={iconType} />
      <SettingTextBlock title={title ?? "-"} subtitle={subtitle ?? "-"} />
      <Icon name="chevron-forward" size={20} color={Colors.txt} />
    </TouchableOpacity>
  );
}
