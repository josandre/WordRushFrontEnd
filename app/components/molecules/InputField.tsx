import React from "react";
import { View, Text, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import mstyles from "./styles";
import { Colors } from "../../theme/color";

type InputFieldProps = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  leftIconName?: string;
  error?: string;
};

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder = "Your email address",
  leftIconName = "mail-outline",
  error,
}: InputFieldProps) {
  return (
    <>
      <Text style={[mstyles.fieldLabel, { color: Colors.txt }]}>{label}</Text>
      <View style={[mstyles.fieldContainer, { backgroundColor: Colors.bg }]}>
        <Icon name={leftIconName} size={24} color={Colors.primary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.disable}
          selectionColor={Colors.primary}
          value={value}
          onChangeText={onChangeText}
          style={[mstyles.textInput, { color: Colors.active }]}
        />
      </View>
      {!!error && <Text style={mstyles.errorText}>{error}</Text>}
    </>
  );
}
