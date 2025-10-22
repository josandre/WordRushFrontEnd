import { StyleSheet, Platform } from "react-native";
import { Colors } from "../../../theme/color";

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.bord,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  main: {
    backgroundColor: Colors.bord,
    marginTop: Platform.OS === "ios" ? 10 : 30,
  },
  appBar: {
    backgroundColor: "transparent",
  },
  appTitle: {
    color: Colors.txt,
  },
  instructionText: {
    color: Colors.disable,
    marginTop: 5,
  },
  backButton: {
    // Additional styles for back button if needed
  },
});
