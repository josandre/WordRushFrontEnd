import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import moleculeStyles from "./styles";

import { AppBar } from "@react-native-material/core";
import Icon from "react-native-vector-icons/Ionicons";

interface ScreenTitleBarProperties {
  screenName: string;
  onGoBackPress: () => void;
}

export default function ScreenTitleBar({
  screenName,
  onGoBackPress,
}: ScreenTitleBarProperties) {
  return (
    <View style={moleculeStyles.screenTitleBar}>
      <AppBar
        title={screenName}
        titleStyle={[
          style.apptitle,
          { color: Colors.secondary, marginLeft: 25 },
        ]}
        centerTitle={true}
        style={{ backgroundColor: "transparent" }}
        elevation={0}
        leading={
          <TouchableOpacity onPress={onGoBackPress}>
            <Icon name="arrow-back" size={24} color={Colors.secondary} />
          </TouchableOpacity>
        }
      />
    </View>
  );
}
