import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import atomStyles from "./styles";

interface DescriptionButtonProperties {
  title: string;
  description: string;
  icon?: ImageSourcePropType;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Used as a main option in some screens, it shows a  container with an icon, a title and a description
// That can be pressed to trigger a functionality
export default function DescriptionButton({
  title,
  description,
  icon,
  onPress,
  loading = false,
  disabled = false,
}: DescriptionButtonProperties) {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          style.box,
          atomStyles.descriptionButton,
          (disabled || loading) ? { opacity: 0.6 } : null,
        ]}
      >
        <Image
          source={icon}
          resizeMode="stretch"
          style={{ height: 64, width: 64 }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[style.m16, { color: Colors.txt }]}>{title}</Text>
          <Text style={[style.r12, { color: Colors.disable, marginTop: 7 }]}>
            {description}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Icon name="chevron-forward" size={24} color={Colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
}
