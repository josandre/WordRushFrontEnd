import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";

export default function Lobby() {
  const navigation = useNavigation<AppNavigation>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [players, setPlayers] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(true);

  // --- Exit Lobby ---
  function exitLobby(): void {
    socket?.close();
    navigation.navigate("MyTabs");
  }

  // --- Start Game ---
  function onStartGame(): void {
    if (!socket) return;
    socket.send("START_GAME");
  }

  // --- Copy Room Link (Cross-platform) ---
  async function copyToClipboard() {
    if (!roomId) return;

    const link = `ws://localhost:5178/ws`;
    const text = `Share this room ID: ${roomId}\nConnect using ${link}`;

    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(text);
    } else {
      await Clipboard.setStringAsync(text);
    }

    Alert.alert("Copied!", "Room link copied to clipboard.");
  }

  // --- Initialize WebSocket ---
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5178/ws"); // Change to your backend address
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send("CREATE_GAMEROOM");
    };

    ws.onmessage = (event) => {
      console.log("Received:", event.data);

      // Match "Room created! Room ID: XXXXX"
      const roomMatch = event.data.match(/Room ID:\s*(.+)$/);
      if (roomMatch) {
        const id = roomMatch[1].trim();
        setRoomId(id);
        setIsOwner(true);
      }

      // Handle user list updates
      if (event.data.startsWith("USER_LIST_JSON:")) {
        try {
          const list = JSON.parse(
            event.data.substring("USER_LIST_JSON:".length)
          );
          setPlayers(list);
        } catch {
          console.warn("Failed to parse user list");
        }
      }

      // Room closed events
      if (
        event.data === "ROOM_CLOSED_BY_OWNER" ||
        event.data === "ROOM_CLOSED"
      ) {
        Alert.alert("Room Closed", "The host closed the room.");
        ws.close();
        navigation.navigate("MyTabs");
      }

      // Game starting
      if (event.data === "GAME_STARTING") {
        navigation.navigate("GameRoom", { roomId, isOwner });
      }
    };

    ws.onclose = () => console.log("Disconnected from WebSocket");

    return () => {
      ws.close();
    };
  }, []);

  // --- Render ---
  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScreenTitleBar screenName="Game Lobby" onGoBackPress={exitLobby} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title=""
          content={
            <View>
              <Text
                style={[
                  style.subtitle,
                  { color: Colors.txt, marginBottom: 10 },
                ]}
              >
                {roomId ? `Room ID: ${roomId}` : "Creating room..."}
              </Text>

              {roomId && (
                <PrimaryButton
                  title="Copy Room Link"
                  onPress={copyToClipboard}
                  disabled={false}
                />
              )}

              <PrimaryButton
                title="Start Game"
                onPress={onStartGame}
                disabled={!isOwner}
              />

              <View style={{ marginTop: 20 }}>
                <Text
                  style={[
                    style.subtitle,
                    { color: Colors.txt, marginBottom: 10 },
                  ]}
                >
                  Players in Room:
                </Text>
                {players.length > 0 ? (
                  players.map((p, i) => (
                    <Text key={i} style={[style.r16, { color: Colors.txt }]}>
                      {p.nickname ?? p.userId}
                      {p.isOwner ? " (Host)" : ""}
                      {p.isReady ? " ✅" : ""}
                    </Text>
                  ))
                ) : (
                  <Text style={[style.r16, { color: Colors.txt }]}>
                    Waiting for players...
                  </Text>
                )}
              </View>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
