import React from "react";
import { Text } from "react-native";
import mstyles from "./styles";
import { Colors } from "../../theme/color";
import base from "../../theme/style";

export default function TermsNotice() {
  return (
    <Text style={[mstyles.termsText, { color: Colors.disable }]}>
      By continuing, you agree to the{" "}
      <Text style={[base.m14, { color: Colors.txt1 }]}>Terms of Services</Text>{" "}
      &<Text style={[base.m14, { color: Colors.txt1 }]}> Privacy Policy.</Text>
    </Text>
  );
}
