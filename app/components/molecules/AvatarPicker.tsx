import React, { useRef } from "react";
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

// 30% bigger
const AVATAR_SIZE = 90;
const SPACING = 10;
const SCROLL_STEP = 250;

export default function AvatarPicker({ avatar, onChange }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollXRef = useRef(0);

  // for scroll clamp
  const viewportWidthRef = useRef(0);
  const contentWidthRef = useRef(0);

  const avatarKeys = Object.keys(avatars) as AvatarId[];

  //
  // ---------------- MOBILE VERSION (2 rows) ----------------
  //
  if (Platform.OS !== "web") {
    const half = Math.ceil(avatarKeys.length / 2);
    const row1 = avatarKeys.slice(0, half);
    const row2 = avatarKeys.slice(half);

    const perItem = AVATAR_SIZE + SPACING;
    const rowPixelWidth = perItem * row1.length + 15;

    return (
      <View style={styles.webWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            scrollXRef.current = e.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
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
      </View>
    );
  }

  //
  // ---------------- WEB VERSION (3 rows + scroll clamp) ----------------
  //

  // split into 3 rows
  const itemsPerRow = Math.ceil(avatarKeys.length / 3);
  const row1 = avatarKeys.slice(0, itemsPerRow);
  const row2 = avatarKeys.slice(itemsPerRow, itemsPerRow * 2);
  const row3 = avatarKeys.slice(itemsPerRow * 2);

  // calculate real width (based on longest row)
  const longestRow = Math.max(row1.length, row2.length, row3.length);
  const perItem = AVATAR_SIZE + SPACING;
  const rowPixelWidth = longestRow * perItem + 15;

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
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollXRef.current = e.nativeEvent.contentOffset.x;
        }}
        onLayout={(e) => {
          viewportWidthRef.current = e.nativeEvent.layout.width;
        }}
      >
        <View
          style={[styles.threeRowContainer, { width: rowPixelWidth }]}
          onLayout={(e) => {
            contentWidthRef.current = e.nativeEvent.layout.width;
          }}
        >
          {/* Row 1 */}
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

          {/* Row 2 */}
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

          {/* Row 3 */}
          <View style={styles.row}>
            {row3.map((item) => {
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

  threeRowContainer: {
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
    height: AVATAR_SIZE * 4,
    justifyContent: "center",
    alignItems: "center",
  },

  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderRightWidth: 24,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "#888",
  },

  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderLeftWidth: 24,
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
