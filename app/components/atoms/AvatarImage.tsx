import React from "react";
import { Image } from "react-native";

export default function AvatarImage({
  source,
  size = 100,
}: {
  source: any;
  size?: number;
}) {
  return (
    <Image
      source={source}
      resizeMode="stretch"
      style={{
        height: size,
        width: size,
        alignSelf: "center",
      }}
    />
  );
}
