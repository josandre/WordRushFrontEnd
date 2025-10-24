import React from "react";
import { View, Text, Image } from "react-native";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import avatars, { getAvatarImage } from "@/assets/avatars";

export type PlayerCardProps = {
  nickname: string;
  avatar: string;
  isReady: boolean;
  isOwner?: boolean;
  readyLabel?: string;
  showReadyButton?: boolean;
  onToggleReady?: () => void;
};

export default function PlayerCard({
  nickname,
  avatar,
  isReady,
  isOwner,
  readyLabel,
  showReadyButton,
  onToggleReady,
}: PlayerCardProps) {
  const avatarImage = getAvatarImage(avatar) || avatars["default"];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.card ?? "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Avatar and info */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={avatarImage}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 10,
            backgroundColor: "#eee",
          }}
        />
        <View>
          <Text style={[style.subtitle, { color: Colors.txt }]}>
            {nickname} {isOwner ? "(Host)" : ""}
          </Text>
          <Text
            style={{
              color: isReady ? Colors.success : Colors.warning,
              fontWeight: "600",
            }}
          >
            {readyLabel ?? (isReady ? "Ready" : "Not Ready")}
          </Text>
        </View>
      </View>

      {/* Ready button only for current user */}
      {showReadyButton && (
        <PrimaryButton
          title={isReady ? "Not Ready" : "Ready!"}
          onPress={onToggleReady}
          textStyle={{
            fontSize: 14,
            paddingHorizontal: 10,
            color: Colors.secondary,
          }}
        />
      )}
    </View>
  );
}
