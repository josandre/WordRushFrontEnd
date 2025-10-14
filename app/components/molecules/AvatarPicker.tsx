import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import avatars, { AvatarId } from "@/assets/avatars";

type Props = {
  avatar: AvatarId;
  onChange: (id: AvatarId) => void;
};

const AVATAR_SIZE = 70;
const SPACING = 10;
// Total width of one item (Avatar size + margin on both sides)
const ITEM_WIDTH = AVATAR_SIZE + SPACING;

export default function AvatarPicker({ avatar, onChange }: Props) {
  const flatListRef = useRef<FlatList<AvatarId>>(null);
  const avatarKeys = Object.keys(avatars) as AvatarId[]; // explicit cast

  // Fix: Use getItemLayout to prevent 'scrollToIndex' error
  const getItemLayout = (data: any, index: number) => ({
    // length is the fixed width of a single item
    length: ITEM_WIDTH,
    // offset is the starting point of the item in the list (index * item width)
    offset: ITEM_WIDTH * index,
    index,
  });

  // Scroll to selected avatar on mount / avatar change
  useEffect(() => {
    const index = avatarKeys.indexOf(avatar);
    if (index >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [avatar]);

  return (
    <View style={{ marginVertical: 20 }}>
      <FlatList
        ref={flatListRef}
        data={avatarKeys}
        horizontal
        keyExtractor={(item: AvatarId) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        // ✅ The Fix: Adding getItemLayout
        getItemLayout={getItemLayout}
        renderItem={({ item }: { item: AvatarId }) => {
          const isSelected = item === avatar;
          return (
            <TouchableOpacity
              onPress={() => onChange(item)}
              style={[
                styles.avatarContainer,
                isSelected && styles.selectedAvatar,
              ]}
            >
              <Image source={avatars[item]} style={styles.avatar} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    // Width and height are AVATAR_SIZE
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    // Horizontal margin is SPACING / 2, making the total gap SPACING
    marginHorizontal: SPACING / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "#007AFF",
  },
  avatar: {
    width: AVATAR_SIZE - 10,
    height: AVATAR_SIZE - 10,
    borderRadius: (AVATAR_SIZE - 10) / 2,
  },
});
