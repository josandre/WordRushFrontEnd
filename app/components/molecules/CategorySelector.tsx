import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import moleculeStyles from "./styles";
import { Category } from "../../screens/Home/constants";

type CategorySelectorProps = {
  categories: Category[];
};

export default function CategorySelector({
  categories,
}: CategorySelectorProps) {
  if (categories.length === 0) {
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
          {categories.map((category) => {
            const categoryName =
              category.column || (category as any).Column || "Unknown";

            const dynamicWidth = Math.max(80, categoryName.length * 8 + 24);

            return (
              <View
                key={category.id}
                style={[
                  moleculeStyles.letterButton,
                  {
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
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
