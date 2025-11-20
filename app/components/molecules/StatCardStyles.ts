import { StyleSheet, Platform } from "react-native";
import { Colors } from "../../theme/color";

export default StyleSheet.create({
  statCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.active,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statCardContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: Platform.OS === "web" ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: "400",
    color: Colors.disable,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 32,
    fontFamily: Platform.OS === "web" ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: "700",
    color: Colors.txt,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    fontFamily: Platform.OS === "web" ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: "400",
    color: Colors.disable,
  },
});

