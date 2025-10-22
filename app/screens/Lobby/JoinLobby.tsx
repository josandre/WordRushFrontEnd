import { View, StatusBar, ScrollView } from "react-native";
import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";

import { SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";

import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";

import InputField from "../../components/molecules/InputField";
import PrimaryButton from "../../components/atoms/PrimaryButton";

//TODO: Add functionality
export default function JoinLobby() {
  const navigation = useNavigation<AppNavigation>();

  const [gameID, setGameID] = useState("");

  const isNonEmpty = (val: string) => val.trim().length > 0;

  const gameIDError = isNonEmpty(gameID) ? "" : "Enter a valid Game ID";

  function exitLobby(): void {
    navigation.navigate("MyTabs");
  }

  function onJoin(): void {
    // TODO: Check if the room exists
    // TODO: Join the Game Room
    // TODO: Handle the case where the Room doesn't exist
    if (isNonEmpty(gameID)) {
      navigation.navigate("Lobby");
    }
  }

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />

      <ScreenTitleBar
        screenName="Join Game"
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
              <InputField
                label="Game ID"
                value={gameID}
                onChangeText={setGameID}
                placeholder=""
                leftIconName=""
                error={gameIDError}
              />
              <PrimaryButton
                title="Join Game"
                onPress={() => onJoin()}
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
