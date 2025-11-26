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
        backgroundColor: "#f4f4f4ff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
          <Text>{isOwner ? "👑 " : ""}</Text>
          <Text style={[style.subtitle, { color: Colors.txt }]}>
            {nickname}
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
