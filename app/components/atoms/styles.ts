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
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '70%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9EF',
  },
  selectOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});
