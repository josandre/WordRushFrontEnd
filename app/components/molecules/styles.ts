import { StyleSheet } from "react-native";
import { Colors } from "../../theme/color";
import base from "../../theme/style";
import { getWebStyles } from "../../utils/webStyles";

import { widthPercentage } from "@/app/utils/responsiveStyles";

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
  avatarSelectorContainer: {
    marginTop: 20,
  },
  avatarSelectorLabel: {
    ...base.r14,
    marginBottom: 12,
  },
  avatarListContainer: {
    paddingHorizontal: 5,
  },
  avatarRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#E5E9EF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bg,
    position: "relative",
  },
  avatarSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarImageSelected: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  avatarCheckmark: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  // Web-specific avatar styles
  webAvatarRow: getWebStyles({
    justifyContent: "flex-start",
    gap: "12px",
  }),
  webAvatarListContainer: getWebStyles({
    paddingHorizontal: 0,
    gap: "12px",
  }),
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
  // Letter Selector styles
  letterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
  },
  letterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  selectedLettersContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.bord,
    borderRadius: 8,
  },
  selectedLettersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedLetterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  removeLetterButton: {
    marginLeft: 4,
    padding: 2,
  },
  // Order Selector styles
  orderSelectorContainer: {
    gap: 8,
  },
  orderOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  orderOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Category select styles
  removeCategoryBtn: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: -4,
    right: -4,
    backgroundColor: '#ff5353ff',
    borderRadius: 10,
    padding: 2,
    elevation: 2,        // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
