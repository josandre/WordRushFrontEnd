import React from "react";
import { TextInput, StyleSheet } from "react-native";

type Props = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const InputAtom: React.FC<Props> = ({
  placeholder,
  value,
  onChangeText,
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
});
