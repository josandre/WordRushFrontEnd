import { StyleSheet } from "react-native";
import { Colors } from "../../theme/color";
import base from "../../theme/style";

// Reuse base styles where possible; expose semantic classes for atoms
export default StyleSheet.create({
  linkText: {
    ...base.m16,
    color: Colors.primary,
  },
});
