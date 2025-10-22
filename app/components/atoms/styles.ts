import { StyleSheet } from "react-native";
import { Colors } from "../../theme/color";
import base from "../../theme/style";
import { widthPercentage } from "@/app/utils/responsiveStyles";

// Reuse base styles where possible; expose semantic classes for atoms
export default StyleSheet.create({
  contentCard: {
    padding: 20,

    marginTop: 20,
    marginLeft: widthPercentage(5),
    marginRight: widthPercentage(5),
    marginBottom: 20,

    backgroundColor: Colors.secondary,

    borderRadius: 20,
  },
  descriptionButton: {
    padding: 12,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    ...base.m16,
    color: Colors.primary,
  },
});
