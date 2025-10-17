import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StatusBar } from "react-native";

import defaultAvatarIcon from "@/assets/image/s1.png";

import { Colors } from "@/app/theme/color";

import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { useNavigation } from "@react-navigation/native";

import style from "@/app/theme/style";
import useGameControllerTest, {
  TestResponse,
} from "./services/useGameControllerTest";

import HomeScreenView from "@/app/components/organisms/HomeScreenView";

export default function Home() {
  const navigation = useNavigation<AppNavigation>();
  const { games, loading, error, data } = useGameControllerTest();
  const [result, setResult] = useState<TestResponse | undefined>();

  function getUserName(): string {
    // TODO: Actually get the active user's username
    return "Guest";
  }

  function getUserAvatar() {
    // TODO: Actually get the active user's avatar
    return defaultAvatarIcon;
  }

  function hostGame(): void {
    // TODO: Actually create a lobby for other players to join
    navigation.navigate("Lobby");
  }

  function joinGame(): void {
    navigation.navigate("JoinLobby");
  }

  // THIS IS JUST FOR TESTING AUTH INTERCEPTOR< IT SHOULD BE REMOVED
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await games()
        setResult(res.data)
      } catch (err) {
        alert('Error fetching games:')
      }
    };

    fetchGames();
  }, []); // 👈 empty dependency array = run once on mount

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <Text
        style={{
          color: Colors.bg,
          fontSize: 16,
          textAlign: "center",
          margin: 20,
        }}
      >
        {loading && "Loading..."}
        {error && "Error loading games"}
        {result?.name}
      </Text>

      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />

      <HomeScreenView
        username={getUserName()}
        avatar={getUserAvatar()}
        onHostGamePress={hostGame}
        onJoinGamePress={joinGame}
      ></HomeScreenView>
    </SafeAreaView>
  );
}
