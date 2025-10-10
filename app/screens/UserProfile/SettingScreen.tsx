import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Platform,
  View,
} from "react-native";
import SettingsHeader from "../../components/organisms/SettingsHeader";
import SettingsList from "../../components/organisms/SettingsList";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";

export default function SettingScreen() {
  const [isEnabled, setIsEnabled] = useState(true);
  const navigation = useNavigation<AppNavigation>();

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.bg }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            style.main,
            {
              backgroundColor: Colors.bg,
              marginTop: Platform.OS === "ios" ? 10 : 30,
            },
          ]}
        >
          <SettingsHeader />
          <SettingsList
            notificationEnabled={isEnabled}
            onToggleNotification={() => setIsEnabled(!isEnabled)}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Login", { fromRegisterSuccess: false })
            }
          >
            <Text
              style={[
                style.m16,
                {
                  color: "#EB5757",
                  textAlign: "center",
                  marginTop: 30,
                  marginBottom: 20,
                },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
