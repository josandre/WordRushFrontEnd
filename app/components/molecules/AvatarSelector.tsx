import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import styles from "./styles";
import { AVAILABLE_AVATARS, avatarImages } from "./constants";

type AvatarSelectorProps = {
  selectedAvatar?: string;
  onAvatarSelect: (avatarName: string) => void;
  label?: string;
};

export default function AvatarSelector({
  selectedAvatar,
  onAvatarSelect,
  label = "Choose Avatar",
}: AvatarSelectorProps) {
  const [selected, setSelected] = useState<string>(
    selectedAvatar || AVAILABLE_AVATARS[0],
  );

  // Notify parent component about the default selection on mount
  useEffect(() => {
    if (!selectedAvatar) {
      onAvatarSelect(AVAILABLE_AVATARS[0]);
    }
  }, []);

  const handleAvatarPress = (avatarName: string) => {
    setSelected(avatarName);
    onAvatarSelect(avatarName);
  };

  const renderAvatar = ({ item }: { item: string }) => {
    const isSelected = selected === item;
    return (
      <TouchableOpacity
        style={[styles.avatarContainer, isSelected && styles.avatarSelected]}
        onPress={() => handleAvatarPress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={avatarImages[item as keyof typeof avatarImages]}
          style={[styles.avatarImage, isSelected && styles.avatarImageSelected]}
          resizeMode="contain"
        />
        {isSelected && <View style={styles.avatarCheckmark} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.avatarSelectorContainer}>
      <Text style={styles.avatarSelectorLabel}>{label}</Text>
      <FlatList
        data={AVAILABLE_AVATARS}
        renderItem={renderAvatar}
        keyExtractor={(item) => item}
        numColumns={4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.avatarListContainer,
          styles.webAvatarListContainer,
        ]}
        columnWrapperStyle={[styles.avatarRow, styles.webAvatarRow]}
      />
    </View>
  );
}
