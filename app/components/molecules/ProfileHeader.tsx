import React from "react";
import { Text } from "react-native";
import AvatarImage from "../atoms/AvatarImage";
import style from "../../theme/style";
import { Colors } from "../../theme/color";

export default function ProfileHeader({ avatar, nickname }: any) {
  return (
    <>
      <Text
        style={[
          style.apptitle,
          {
            color: Colors.txt,
            textAlign: "center",
            marginTop: 4,
            marginBottom: 10,
          },
        ]}
      >
        {nickname}
      </Text>
      <AvatarImage source={avatar} size={100} />
    </>
  );
}
