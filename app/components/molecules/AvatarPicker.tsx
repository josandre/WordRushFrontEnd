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

const ITEM_WIDTH = AVATAR_SIZE + SPACING;

export default function AvatarPicker({ avatar, onChange }: Props) {
  const flatListRef = useRef<FlatList<AvatarId>>(null);
  const avatarKeys = Object.keys(avatars) as AvatarId[];

  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  useEffect(() => {
    const index = avatarKeys.indexOf(avatar);
    if (index >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [avatar, avatarKeys]);

  return (
    <View style={{ marginVertical: 20 }}>
      <FlatList
        ref={flatListRef}
        data={avatarKeys}
        horizontal
        keyExtractor={(item: AvatarId) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
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
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
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
