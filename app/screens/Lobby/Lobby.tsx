import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import PlayerCard from "@/app/components/molecules/PlayerCard";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { SocketStore } from "@/app/utils/socketStore";
import { useClipboard } from "@/app/utils/useClipboard";
import { WS_URL } from "@/app/utils/wsConfig";

export default function Lobby() {
  const { copyToClipboard } = useClipboard();
  const navigation = useNavigation<AppNavigation>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [storedProfile, setStoredProfile] = useState<any>(null);

  // Confirm leaving (Android back or header)
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        e.preventDefault();
        Alert.alert("Leave Lobby", "Do you want to close this room?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => {
              const ws = socket || SocketStore.getSocket();
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send("CLOSE_GAMEROOM");
                ws.close();
              }
              Alert.alert(
                "Lobby Closed",
                "The room has been closed for all players."
              );
              navigation.dispatch(e.data.action);
            },
          },
        ]);
      };

      navigation.addListener("beforeRemove", onBeforeRemove);
      return () => navigation.removeListener("beforeRemove", onBeforeRemove);
    }, [socket, navigation])
  );

  useEffect(() => {
    let ws: WebSocket;
    let isProfileReady = false;

    const setupSocket = async () => {
      const profile = await getStoredProfile();
      setStoredProfile(profile);
      isProfileReady = true;

      ws = new WebSocket(WS_URL);
      if (!ws) return;

      ws.onopen = () => {
        console.log("Connected to WebSocket (Lobby)");
        SocketStore.setSocket(ws);
        setConnected(true);

        // Create the room once connection and profile are ready
        if (isProfileReady) ws.send("CREATE_GAMEROOM");
      };

      ws.onmessage = async (event) => {
        const data = event.data?.trim();
        if (!data) return;
        console.log("Lobby message:", data);

        // Handle room created
        if (data.toLowerCase().startsWith("room_created:")) {
          const id = data.split(":")[1]?.trim();
          setRoomId(id);

          if (profile) {
            const payload = {
              Nickname: profile.nickname ?? "Player",
              Avatar: profile.avatar ?? "default",
              Email: profile.email ?? "",
            };
            ws?.send(`UPDATE_PROFILE:${JSON.stringify(payload)}`);
          }
          return;
        }

        // Handle user list
        if (data.startsWith("USER_LIST_JSON:")) {
          try {
            const json = data.substring("USER_LIST_JSON:".length);
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) setPlayers(parsed);
          } catch (err) {
            console.error("Parse error:", err, data);
          }
          return;
        }

        // Game starting
        if (data === "GAME_STARTING") {
          navigation.navigate("GameRoom", {
            roomId: roomId ?? "",
            isOwner: true,
            players,
          });
          return;
        }

        // Room closed
        if (
          data === "ROOM_CLOSED_BY_OWNER" ||
          data === "Room closed by owner."
        ) {
          Alert.alert("Room Closed", "The host closed the room.");
          ws?.close();
          navigation.navigate("MyTabs");
          return;
        }
      };

      ws.onclose = () => console.log("WebSocket closed (Lobby)");
      setSocket(ws);
    };

    setupSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [navigation]);

  const handleToggleReady = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) ws.send("TOGGLE_READY");
  };

  const handleStartGame = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && connected && roomId) {
      setIsStarting(true);
      ws.send("START_GAME");
    }
  };

  const handleCloseRoom = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("CLOSE_GAMEROOM");
      ws.close();
    }
    Alert.alert(
      "Lobby Closed",
      "The game room has been closed for all players."
    );
    navigation.navigate("MyTabs");
  };

  const allReady = players.length > 0 && players.every((p) => p.IsReady);

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScreenTitleBar screenName="Game Lobby" onGoBackPress={handleCloseRoom} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title="Lobby"
          content={
            <View>
              {roomId ? (
                <>
                  <Text
                    style={[
                      style.subtitle,
                      { color: Colors.txt, textAlign: "center" },
                    ]}
                  >
                    Room ID: {roomId}
                  </Text>
                  <PrimaryButton
                    title="Copy Room Code"
                    onPress={() => copyToClipboard(roomId ?? "")}
                  />
                </>
              ) : (
                <ActivityIndicator size="large" color={Colors.secondary} />
              )}

              <View style={{ marginTop: 15 }}>
                {players.length > 0 ? (
                  players.map((p) => {
                    const myEmail = storedProfile?.email?.toLowerCase();
                    const myNickname = storedProfile?.nickname
                      ?.trim()
                      ?.toLowerCase();
                    const isMe =
                      p.Email?.toLowerCase() === myEmail ||
                      p.Nickname?.trim()?.toLowerCase() === myNickname;

                    return (
                      <PlayerCard
                        key={p.UserId}
                        nickname={p.Nickname}
                        avatar={p.Avatar}
                        isReady={p.IsReady}
                        isOwner={p.IsOwner}
                        readyLabel={p.IsReady ? "Ready" : "Not Ready"}
                        showReadyButton={isMe}
                        onToggleReady={handleToggleReady}
                      />
                    );
                  })
                ) : (
                  <Text style={{ color: Colors.txt, textAlign: "center" }}>
                    Waiting for players...
                  </Text>
                )}
              </View>

              {players.length > 0 && (
                <View style={{ marginTop: 30, alignItems: "center" }}>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    {allReady
                      ? "✅ All players are ready!"
                      : "Waiting for all players to be ready..."}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row", // arrange buttons horizontally
                      justifyContent: "space-between", // space them out evenly
                      padding: 10,
                      gap: 12,
                    }}
                  >
                    <PrimaryButton
                      title="   Close Room   "
                      onPress={handleCloseRoom}
                      disabled={!connected}
                    />
                    <PrimaryButton
                      title="   Start Game   "
                      onPress={handleStartGame}
                      disabled={!connected || isStarting || !allReady}
                      loading={isStarting}
                    />
                  </View>
                </View>
              )}
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
