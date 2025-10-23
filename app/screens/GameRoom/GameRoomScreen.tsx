import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from "react-native";
import { GameRoom } from "../../components/organisms/GameRoom";

export const GameRoomScreen = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.scroll}>
      <GameRoom />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scroll: { padding: 16 },
});
