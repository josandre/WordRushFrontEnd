import React from "react";
import { View } from "react-native";
import PrimaryButton from "../atoms/PrimaryButton";
import styles from "./styles";

type OptionActionsProps = {
  onLogin: () => void;
  onSignup: () => void;
};

export default function OptionActions({
  onLogin,
  onSignup,
}: OptionActionsProps) {
  return (
    <View style={styles.actionsContainer}>
      <PrimaryButton title="Login" onPress={onLogin} />
      <PrimaryButton title="Create an account" onPress={onSignup} />
    </View>
  );
}

