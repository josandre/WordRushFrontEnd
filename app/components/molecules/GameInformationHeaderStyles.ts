import { StyleSheet, Platform } from "react-native";
import { Colors } from "../../theme/color";

export default StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Platform.OS === "web" ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: "600",
    color: Colors.txt,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Platform.OS === "web" ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: "400",
    color: Colors.disable,
    textAlign: "center",
  },
});

