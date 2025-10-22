import React, { useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <Text style={[mstyles.fieldLabel, { color: Colors.txt }]}>{label}</Text>
      <View
        style={[
          mstyles.fieldContainer,
          {
            backgroundColor: Colors.bg,
            borderWidth: isFocused ? 2 : 1,
            borderColor: isFocused ? Colors.primary : "#E5E9EF",
          },
        ]}
      >
        <Icon name={leftIconName} size={24} color={Colors.primary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.disable}
          selectionColor={Colors.primary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[mstyles.textInput, { color: Colors.active, outline: "none" }]}
        />
      </View>
      {!!error && <Text style={mstyles.errorText}>{error}</Text>}
    </>
  );
}
