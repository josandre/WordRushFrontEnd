import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./color";
import { isWeb } from "../utils/envDetails";

const { width: screenWidth } = Dimensions.get("screen");
const { width: windowWidth } = Dimensions.get("window");

const width = isWeb ? windowWidth : screenWidth;

const isDesktop = width > 1024;

export default StyleSheet.create({
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
  area: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  main: {
    flex: 1,
    paddingHorizontal: isWeb && isDesktop ? 40 : 20,
    backgroundColor: Colors.bg,
  },
  title: {
    fontSize: isWeb && isDesktop ? 36 : 32,
    color: Colors.secondary,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
  },
  apptitle: {
    fontSize: isWeb && isDesktop ? 28 : 24,
    color: Colors.secondary,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.secondary,
  },

  s20: {
    fontSize: 20,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
    color: Colors.secondary,
  },
  b20: {
    fontSize: 20,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: isWeb ? "700" : "normal",
    color: Colors.secondary,
  },
  s24: {
    fontSize: 24,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
    color: Colors.secondary,
  },
  b24: {
    fontSize: 24,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: isWeb ? "700" : "normal",
    color: Colors.secondary,
  },
  m22: {
    fontSize: 22,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.secondary,
  },

  r10: {
    fontSize: 10,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
    color: Colors.active,
  },
  m10: {
    fontSize: 10,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.active,
  },

  r12: {
    fontSize: 12,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
    color: Colors.active,
  },
  m12: {
    fontSize: 12,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.active,
  },
  b12: {
    fontSize: 12,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: isWeb ? "700" : "normal",
    color: Colors.active,
  },
  s12: {
    fontSize: 12,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
    color: Colors.active,
  },

  r14: {
    fontSize: 14,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
    color: Colors.active,
  },
  m14: {
    fontSize: 14,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.active,
  },
  b14: {
    fontSize: 14,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: isWeb ? "700" : "normal",
    color: Colors.active,
  },
  s14: {
    fontSize: 14,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
    color: Colors.active,
  },

  r16: {
    fontSize: 16,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
    color: Colors.active,
  },
  m16: {
    fontSize: 16,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.active,
  },
  b16: {
    fontSize: 16,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: isWeb ? "700" : "normal",
    color: Colors.active,
  },
  s16: {
    fontSize: 16,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
    color: Colors.active,
  },

  r18: {
    fontSize: 18,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
    color: Colors.active,
  },
  m18: {
    fontSize: 18,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
    color: Colors.active,
  },
  b18: {
    fontSize: 18,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Bold",
    fontWeight: isWeb ? "700" : "normal",
    color: Colors.active,
  },
  s18: {
    fontSize: 18,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-SemiBold",
    fontWeight: isWeb ? "600" : "normal",
    color: Colors.active,
  },
  text: {
    fontSize: 15,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
    color: Colors.active,
  },
  modalcontainer: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    // marginVertical: 140,
    paddingTop: 20,
    marginHorizontal: -10,
    alignSelf: "center",
  },

  icon: {
    height: 24,
    width: 24,
    borderRadius: 30,
    borderColor: "#E6E6E6",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    marginTop: 10,
  },

  btn: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
  },
  btntxt: {
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
  },
  btnoutline: {
    alignItems: "center",
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    borderColor: "#6A5AE020",
    borderWidth: 1,
  },
  btn2: {
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
  },

  txtinput: {
    paddingHorizontal: 10,
    height: 56,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#bfc6d1ff",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  inputcontainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
  },
  search: {
    height: 56,
    borderRadius: 20,
    backgroundColor: "#0C092A16",
    alignItems: "center",
    flexDirection: "row",
  },

  box: {
    padding: 15,
    borderColor: "#EFEEFC",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  indicator: {
    height: 8,
    width: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
  },

  boxShadow: {
    shadowColor: Colors.active,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: Colors.bg,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  dividertxt: {
    color: Colors.disable,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Regular",
    fontWeight: isWeb ? "400" : "normal",
  },

  verticaldivider: {
    height: "60%",
    width: 1,
  },

  follow: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  following: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: Colors.bg1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  categoryTextSelected: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
    // borderWidth: 0,
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    color: Colors.secondary,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
  },
  categoryText: {
    fontSize: 19,
    color: Colors.active,
    borderWidth: 0,
    backgroundColor: Colors.secondary,
    borderRadius: 7,
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    fontFamily: isWeb ? "Rubik, sans-serif" : "Rubik-Medium",
    fontWeight: isWeb ? "500" : "normal",
  },
  categorycontainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 0,
    justifyContent: "space-between",
  },
  // ========== Multiplayer / GameRoom Styles ==========
  gameContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 16,
  },
  gameStatus: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
    color: Colors.active,
  },
  gameLabel: {
    fontSize: 15,
    color: Colors.active,
    marginBottom: 4,
  },
  chatBox: {
    flex: 1,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    padding: 8,
  },
  userListLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: Colors.active,
    marginBottom: 6,
  },
  inputSection: {
    marginTop: 10,
  },
  // ========== End GameRoom Styles ==========
});
