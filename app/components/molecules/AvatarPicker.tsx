import React, { useRef, useMemo } from "react";
import {
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import avatars, { AvatarId } from "@/assets/avatars";

type Props = {
  avatar: AvatarId;
  onChange: (id: AvatarId) => void;
};

const AVATAR_SIZE = 120;
const SPACING = 10;
const SCROLL_STEP = 250;

export default function AvatarPicker({ avatar, onChange }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollXRef = useRef(0);

  const viewportWidthRef = useRef(0);
  const contentWidthRef = useRef(0);

  const avatarKeys = Object.keys(avatars) as AvatarId[];

  if (Platform.OS !== "web") {
    return (
      <View style={{ marginVertical: 20 }}>
        <FlatList
          horizontal
          data={avatarKeys}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) => {
            const selected = item === avatar;
            return (
              <TouchableOpacity
                onPress={() => onChange(item)}
                style={[
                  styles.avatarContainer,
                  selected && styles.selectedAvatar,
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

  const midpoint = Math.ceil(avatarKeys.length / 2);
  const row1 = avatarKeys.slice(0, midpoint);
  const row2 = avatarKeys.slice(midpoint);

  const perItem = AVATAR_SIZE + SPACING;
  const rowPixelWidth = perItem * row1.length + 15;

  const onScroll = (event: any) => {
    scrollXRef.current = event.nativeEvent.contentOffset.x;
  };

  const scrollBy = (delta: number) => {
    if (!scrollViewRef.current) return;

    const maxScroll = Math.max(
      0,
      contentWidthRef.current - viewportWidthRef.current,
    );

    const newOffset = Math.max(
      0,
      Math.min(maxScroll, scrollXRef.current + delta),
    );

    scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
    scrollXRef.current = newOffset;
  };

  return (
    <View style={styles.webWrapper}>
      {/* LEFT ARROW */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => scrollBy(-SCROLL_STEP)}
      >
        <View style={styles.arrowLeft} />
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => {
          viewportWidthRef.current = e.nativeEvent.layout.width;
        }}
      >
        <View
          style={[styles.twoRowContainer, { width: rowPixelWidth }]}
          onLayout={(e) => {
            contentWidthRef.current = e.nativeEvent.layout.width;
          }}
        >
          <View style={styles.row}>
            {row1.map((item) => {
              const selected = item === avatar;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => onChange(item)}
                  style={[
                    styles.avatarContainer,
                    selected && styles.selectedAvatar,
                  ]}
                >
                  <Image source={avatars[item]} style={styles.avatar} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.row}>
            {row2.map((item) => {
              const selected = item === avatar;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => onChange(item)}
                  style={[
                    styles.avatarContainer,
                    selected && styles.selectedAvatar,
                  ]}
                >
                  <Image source={avatars[item]} style={styles.avatar} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* RIGHT ARROW */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => scrollBy(SCROLL_STEP)}
      >
        <View style={styles.arrowRight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },

  twoRowContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 5,
    gap: SPACING,
  },

  arrowButton: {
    width: 35,
    height: AVATAR_SIZE * 2 + 10,
    justifyContent: "center",
    alignItems: "center",
  },

  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderRightWidth: 20,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#888",
  },

  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftWidth: 20,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#888",
  },

  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  selectedAvatar: {
    borderColor: "#007AFF",
  },

  avatar: {
    width: AVATAR_SIZE - 12,
    height: AVATAR_SIZE - 12,
    borderRadius: (AVATAR_SIZE - 12) / 2,
  },
});
