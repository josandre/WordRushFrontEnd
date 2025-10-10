import React from "react";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../theme/color";
import style from "../../theme/style";

interface Props {
  icon?: string;
  image?: any;
  label: string;
  value: string | number;
}

export default function StatItem({ icon, image, label, value }: Props) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      {icon ? (
        <Icon name={icon} size={24} color={Colors.secondary} />
      ) : (
        <Image
          source={image}
          style={{ height: 24, width: 24 }}
          resizeMode="stretch"
        />
      )}
      <Text style={[style.m12, { color: "#FFFFFF80", marginTop: 5 }]}>
        {label}
      </Text>
      <Text style={[style.b16, { color: "#FFFFFF", lineHeight: 20 }]}>
        {value}
      </Text>
    </View>
  );
}
