import React from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  TextStyle,
  ViewStyle,
} from "react-native";
import style from "../../theme/style";
import { webButtonStyles, getWebPointerStyles } from "../../utils/webStyles";
import WordRushSpinner from "@/app/components/atoms/WordRushSpinner";
type PrimaryButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({
  title,
  onPress,
  textStyle,
  disabled,
  loading,
  style: customStyle,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        style.btn,
        style.container,
        webButtonStyles,
        getWebPointerStyles(),
        customStyle,
        disabled || loading ? { opacity: 0.5 } : null,
      ]}
    >
      {loading ? (
        <WordRushSpinner text="Loading..." textColor="#000" size={100} />
      ) : (
        <Text style={[style.btntxt, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
