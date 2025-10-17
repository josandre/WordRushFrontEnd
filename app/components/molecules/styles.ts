import { StyleSheet } from "react-native";
import { Colors } from "../../theme/color";
import base from "../../theme/style";

import {
  widthPercentage,
  heightPercentage,
} from "@/app/utils/responsiveStyles";

export default StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  dot: {
    ...base.indicator,
  },
  dotActiveWrapper: {
    marginHorizontal: 5,
    height: 16,
    width: 16,
    borderRadius: 8,
    borderColor: Colors.secondary,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  authCtaContainer: {
    flex: 0.4,
    backgroundColor: Colors.bg,
    margin: 20,
    borderRadius: 15,
    padding: 15,
  },
  authCtaTitle: {
    ...base.apptitle,
    color: Colors.active,
    textAlign: "center",
  },
  authCtaHintText: {
    ...base.r16,
    color: Colors.disable,
  },
  authCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  authCtaButton: {
    marginVertical: 20,
  },
  // Login molecules
  socialButton: {
    ...base.btn,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    height: 22,
    width: 22,
  },
  socialLabel: {
    ...base.m16,
    marginLeft: 20,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  orDivider: {
    ...base.divider,
    flex: 1,
  },
  orText: {
    ...base.r16,
    marginHorizontal: 20,
  },
  fieldLabel: {
    ...base.r14,
    marginTop: 10,
  },
  fieldContainer: {
    ...base.inputcontainer,
    marginTop: 8,
  },
  textInput: {
    ...base.r14,
    flex: 1,
    marginBottom: -4,
    marginLeft: 10,
    outline: "none",
  },
  forgotLink: {
    ...base.m16,
    textAlign: "center",
    marginTop: 30,
  },
  termsText: {
    ...base.r14,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 20,
  },
  errorText: {
    ...base.r14,
    color: "#D32F2F",
    marginTop: 6,
  },
  // Option actions
  optionLoginButton: {
    marginTop: 20,
  },
  optionSignupButton: {
    marginTop: 15,
    backgroundColor: Colors.btn,
  },
  optionSignupText: {
    color: Colors.primary,
  },
  optionLaterButton: {
    marginTop: 15,
    backgroundColor: Colors.bg,
  },
  optionLaterText: {
    color: Colors.disable,
  },
  actionsContainer: {
    marginTop: 15,
  },
  welcomeTitleBar: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 30,
    marginLeft: widthPercentage(8),
    marginRight: widthPercentage(8),
  },
  screenTitleBar: {
    marginTop: 30,
    marginLeft: widthPercentage(5),
    marginRight: widthPercentage(5),
  },
});
