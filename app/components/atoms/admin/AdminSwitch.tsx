import React from "react";
import { Switch } from "react-native";

type Props = {
  value: boolean;
  onToggle: () => void;
};

export default function AdminSwitch({ value, onToggle }: Props) {
  return <Switch value={value} onValueChange={onToggle} />;
}
