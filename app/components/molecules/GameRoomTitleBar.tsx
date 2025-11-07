import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";

import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import atomStyles from "./styles";

interface WelcomeTitleBarProperties {
  username: string | undefined;
  avatar?: ImageSourcePropType | undefined;
}

export default function GameRoomTitleBar({
  username,
  avatar,
}: WelcomeTitleBarProperties) {
  return (
    <View>
      <View style={atomStyles.welcomeTitleBar}>
        <Image
          source={avatar}
          resizeMode="stretch"
          style={{ height: 56, width: 56, marginEnd: 12 }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[style.m12, { color: Colors.lpink, marginLeft: 0 }]}>
              Let's WordRush!
            </Text>
          </View>
          <Text style={[style.apptitle, { color: Colors.secondary }]}>
            {username}
          </Text>
        </View>
      </View>
    </View>
  );
}
