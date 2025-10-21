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

// TODO: Add functionality
// TODO: Display list of players
// TODO: Posibility to configure game settings if you are the host
export default function Lobby() {
  const navigation = useNavigation<AppNavigation>();

  function exitLobby(): void {
    navigation.navigate("MyTabs");
  }

  function onConfigureGame(): void {
    navigation.navigate("ConfigureLobby");
  }

  function onStartGame(): void {
    // TODO:
  }

  function getGameID(): string {
    // TODO: Actually get the lobby id
    return "AB1234";
  }

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />

      <ScreenTitleBar
        screenName="Game Lobby"
        onGoBackPress={exitLobby}
      ></ScreenTitleBar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title=""
          content={
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[style.subtitle, { color: Colors.txt, flex: 1 }]}>
                  Game ID: {getGameID()}
                </Text>
              </View>

              <PrimaryButton
                title="Configure Game"
                onPress={() => onConfigureGame()}
                disabled={false}
                loading={false}
              />
              <PrimaryButton
                title="Start Game"
                onPress={() => onStartGame()}
                disabled={false}
                loading={false}
              />

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[style.subtitle, { color: Colors.txt, flex: 1 }]}>
                  Players list
                </Text>
              </View>

              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>
                  Player 1
                </Text>
                <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>
                  Player 2
                </Text>
                <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>
                  Player 3
                </Text>
                <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>
                  Player 4
                </Text>
              </View>
            </View>
          }
        ></ContentCard>
      </ScrollView>
    </SafeAreaView>
  );
}
