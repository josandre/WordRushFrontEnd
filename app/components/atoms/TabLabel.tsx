import React from "react";
import { View, Text } from "react-native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";

export default function TabLabel({
  title,
  focused,
}: {
  title: string;
  focused: boolean;
}) {
  return (
    <View>
      <Text
        style={[
          style.b12,
          {
            color: focused ? Colors.primary : Colors.disable,
            textAlign: "center",
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}
