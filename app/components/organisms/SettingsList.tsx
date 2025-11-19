import React from "react";
import { ScrollView, Text } from "react-native";
import SettingItem from "../molecules/SettingItem";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";

interface SettingsListProps {
  notificationEnabled: boolean;
  onToggleNotification: () => void;
  email: string;
}

export default function SettingsList({ email }: SettingsListProps) {
  const navigation = useNavigation<AppNavigation>();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
      <Text style={[style.m14, { color: Colors.disable }]}>ACCOUNT</Text>

      <SettingItem
        icon="person-outline"
        title="Update Profile"
        subtitle="Update Email, Nickname and Avatar"
        onPress={() => navigation.navigate("UpdateProfile")}
      />
      <SettingItem
        icon="lock-outline"
        iconType="Material"
        title="Change Password"
        subtitle={email ?? "No Email"}
        onPress={() => navigation.navigate("ChangePassword")}
      />
      <SettingItem
        icon="game-controller-outline"
        title="Game Information"
        subtitle="View your game statistics"
        onPress={() => navigation.navigate("GameInformation")}
      />
    </ScrollView>
  );
}
