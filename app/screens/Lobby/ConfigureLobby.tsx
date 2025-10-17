import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";

import { useNavigation } from "@react-navigation/native";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";

import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";

import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";

import PrimaryButton from "../../components/atoms/PrimaryButton";

//TODO: Add functionality
export default function ConfigureLobby() {
  const navigation = useNavigation<AppNavigation>();

  function goBackToLobby(): void {
    navigation.navigate("Lobby");
  }

  function onAccept(): void {
    // TODO: Notify the server about the changes and save them
    goBackToLobby();
  }

  function onDiscard(): void {
    goBackToLobby();
  }

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />

      <ScreenTitleBar
        screenName="Configure Game"
        onGoBackPress={goBackToLobby}
      ></ScreenTitleBar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title=""
          content={
            <View>
              <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>
                Here you will see the lobby settings
              </Text>
              <PrimaryButton
                title="Save Changes"
                onPress={() => onAccept()}
                disabled={false}
                loading={false}
              />
              <PrimaryButton
                title="Discard Changes"
                onPress={() => onDiscard()}
                disabled={false}
                loading={false}
              />
            </View>
          }
        ></ContentCard>
      </ScrollView>
    </SafeAreaView>
  );
}
