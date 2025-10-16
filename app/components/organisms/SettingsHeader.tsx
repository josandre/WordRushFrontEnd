// src/screens/Settings/organisms/SettingsHeader.tsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { AppBar } from "@react-native-material/core";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";

export default function SettingsHeader() {
  const navigation = useNavigation<AppNavigation>();

  return (
    <AppBar
      title="Profile Settings"
      titleStyle={[style.apptitle, { color: Colors.txt, marginLeft: 0 }]}
      centerTitle={true}
      style={{ backgroundColor: "transparent" }}
      elevation={0}
      leading={
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-back" size={24} color={Colors.txt} />
        </TouchableOpacity>
      }
    />
  );
}
