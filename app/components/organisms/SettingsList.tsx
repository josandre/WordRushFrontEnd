import React from "react";
import { ScrollView, Text } from "react-native";
import SettingItem from "../molecules/SettingItem";
import SettingsSwitch from "../molecules/SettingsSwitch";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";

interface SettingsListProps {
  notificationEnabled: boolean;
  onToggleNotification: () => void;
}

export default function SettingsList({
  notificationEnabled,
  onToggleNotification,
}: SettingsListProps) {
  const navigation = useNavigation<AppNavigation>();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
      <Text style={[style.m14, { color: Colors.disable }]}>ACCOUNT</Text>

      <SettingItem
        icon="person-outline"
        title="Update Profile"
        subtitle="Update Email, Nickname, etc"
        onPress={() => navigation.navigate("UpdateProfile")}
      />
      {/* <SettingItem
        icon="mail-outline"
        title="Change Email Address"
        subtitle="madias@yahoo.com"
      />
      <SettingItem
        icon="lock-outline"
        iconType="Material"
        title="Change Password"
        subtitle="last change 1 year ago"
      /> */}

      {/* <Text style={[style.m14, { color: Colors.disable, marginTop: 20 }]}>
        OTHER
      </Text> */}

      <SettingsSwitch
        label="Notifications Enabled"
        value={notificationEnabled}
        onValueChange={onToggleNotification}
      />

      {/* <SettingItem
        icon="people-outline"
        title="Invite Friends"
        subtitle="Easy, normal, hard"
        onPress={() => navigation.navigate("InviteF")}
      />

      <SettingItem
        icon="help-sharp"
        title="FAQ"
        subtitle="Most frequently asked question"
        onPress={() => navigation.navigate("Faq")}
      /> */}
    </ScrollView>
  );
}
