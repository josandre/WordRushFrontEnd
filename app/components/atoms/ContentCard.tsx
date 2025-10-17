import React, { ReactNode } from "react";
import { View, Text } from "react-native";

import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import atomStyles from "./styles";

interface ContentCardProperties {
  title: string;
  content?: ReactNode;
}

// Card component used to group different components in a single box
export default function ContentCard({ title, content }: ContentCardProperties) {
  return (
    <View style={atomStyles.contentCard}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={[style.subtitle, { color: Colors.txt, flex: 1 }]}>
          {title}
        </Text>
      </View>

      {/* All the child content will be rendered here */}
      <View>{content}</View>
    </View>
  );
}
