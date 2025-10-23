import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = {
  text: string;
  type?: "server" | "you" | "error";
};

export const MessageAtom: React.FC<Props> = ({ text, type = "server" }) => (
  <Text style={[styles.message, styles[type]]}>{text}</Text>
);

const styles = StyleSheet.create({
  message: { marginVertical: 2 },
  server: { color: "#0066cc" },
  you: { color: "#008000" },
  error: { color: "#b00020" },
});
