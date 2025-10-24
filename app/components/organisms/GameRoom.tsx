import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import { getAvatarImage } from "@/assets/avatars";

type PlayerCardProps = {
  nickname: string;
  avatar: string;
  isReady: boolean;
  isOwner?: boolean;
  readyLabel?: string; // ✅ explicit prop
};

export default function PlayerCard({
  nickname,
  avatar,
  isReady,
  isOwner,
  readyLabel,
}: PlayerCardProps) {
  const avatarSource = getAvatarImage(avatar);

  return (
    <View style={[styles.card, { backgroundColor: Colors.bg1 }]}>
      <Image source={avatarSource} style={styles.avatar} />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: Colors.txt }]}>{nickname}</Text>
          {isOwner && (
            <Text style={[styles.badge, { backgroundColor: Colors.primary }]}>
              Host
            </Text>
          )}
        </View>

        {readyLabel && (
          <Text
            style={[
              styles.status,
              {
                color: isReady ? Colors.success : Colors.warning,
              },
            ]}
          >
            {readyLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    marginLeft: 8,
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    overflow: "hidden",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
});
