import React from "react";
import { View, Text } from "react-native";
import mstyles from "./styles";
import PrimaryButton from "../atoms/PrimaryButton";
import LinkButton from "../atoms/LinkButton";
import { LOGIN_HELPER_TEXT, LOGIN_TITLE, SIGN_UP_TITLE } from "./constants";

type AuthCTAProps = {
  title: string;
  onSignUp: () => void;
  onLogin: () => void;
};

export default function AuthCTA({ title, onSignUp, onLogin }: AuthCTAProps) {
  return (
    <View style={mstyles.authCtaContainer}>
      <Text style={mstyles.authCtaTitle}>{title}</Text>

      <PrimaryButton title={SIGN_UP_TITLE} onPress={onSignUp} />

      <View style={mstyles.authCtaRow}>
        <Text style={mstyles.authCtaHintText}>{LOGIN_HELPER_TEXT}</Text>
        <LinkButton title={LOGIN_TITLE} onPress={onLogin} />
      </View>
    </View>
  );
}
