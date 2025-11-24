import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import moleculeStyles from "./styles";
import PrimaryButton from "../atoms/PrimaryButton";
import Icon from "react-native-vector-icons/Ionicons";

type CategorySelectorProps = {
  categories: string[] | null;
  newCategory: string;
  waitingForValidCategoryCheck: boolean;
  onNewCategoryChange: (newCategoryValue: string) => void;
  onCategoryAdded: () => void;
  onCategoryRemoved: (categoryIndex: number) => void;
};

export default function CategorySelector({
  categories,
  newCategory,
  waitingForValidCategoryCheck,
  onNewCategoryChange,
  onCategoryAdded,
  onCategoryRemoved,
}: CategorySelectorProps) {
  if (!categories || (categories && categories.length === 0)) {
    return (
      <View>
        <Text style={[style.r16, { color: Colors.txt, marginBottom: 12 }]}>
          Categories
        </Text>
        <Text style={[style.r14, { color: Colors.disable }]}>
          No categories available
        </Text>
      </View>
    );
  }

  const canAddMoreCategories = (): boolean => {
    if (categories && categories.length >= 5) {
      return false;
    }

    if (newCategory.length === 0) {
      return false;
    }

    return true;
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={[style.r16, { color: Colors.txt }]}>Categories</Text>
        <Text style={[style.r14, { color: Colors.disable }]}>
          {categories.length}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        <View style={moleculeStyles.letterGrid}>
          {categories.map((category, index) => {
            const categoryName =
              category || (category as string) || "Unknown";

            const dynamicWidth = Math.max(100, categoryName.length * 8 + 64);

            return (
              <View
                key={category}
                style={[
                  moleculeStyles.letterButton,
                  {
                    flexDirection: "row",
                    backgroundColor: Colors.primary,
                    borderColor: Colors.primary,
                    minWidth: dynamicWidth,
                    width: dynamicWidth,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    style.r14,
                    {
                      color: Colors.secondary,
                      fontWeight: "bold",
                      textAlign: "center",
                    },
                  ]}
                  numberOfLines={2}
                >
                  {categoryName}
                </Text>

                <TouchableOpacity
                  onPress={() => { onCategoryRemoved(index); }}
                  style={[
                    moleculeStyles.removeCategoryBtn,
                  ]}
                >
                  <Icon
                      name="close"
                      size={16}
                      color={"#FFFFFF"}
                    />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

      </ScrollView>
      
      <View>
        <TextInput
          value={newCategory}
          onChangeText={onNewCategoryChange}
          placeholder="e.g. Animal"
          placeholderTextColor={Colors.disable}
          style={style.txtinput}
        />
        <PrimaryButton
          title="Add Category"
          onPress={onCategoryAdded}
          disabled={!canAddMoreCategories()}
          loading={waitingForValidCategoryCheck}
        />
      </View>
    </View>
  );
}
