import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import InputField from "@/app/components/molecules/InputField";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import PlayerCard from "@/app/components/molecules/PlayerCard";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { SocketStore } from "@/app/utils/socketStore";

export default function JoinLobby() {
  const navigation = useNavigation<AppNavigation>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [storedProfile, setStoredProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getStoredProfile();
      setStoredProfile(profile);
    };
    loadProfile();

    const ws = new WebSocket("ws://localhost:5178/ws");
    ws.onopen = () => {
      console.log("Connected to WebSocket (JoinLobby)");
      SocketStore.setSocket(ws);
    };

    ws.onmessage = async (event) => {
      const data = event.data?.trim();
      if (!data) return;
      console.log("JoinLobby message:", data);

      if (data === "ROOM_CLOSED_BY_OWNER" || data === "Room closed by owner.") {
        Alert.alert("Room Closed", "The host closed the room.");
        ws.close();
        navigation.navigate("MyTabs");
        return;
      }

      if (data.startsWith("JOINED_ROOM:")) {
        const id = data.split(":")[1]?.trim();
        setJoinedRoomId(id || null);
        setHasJoined(true);
        setIsJoining(false);

        const stored = await getStoredProfile();
        if (stored) {
          const payload = {
            Nickname: stored.nickname ?? "Player",
            Avatar: stored.avatar ?? "default",
            Email: stored.email ?? "",
          };
          ws.send(`UPDATE_PROFILE:${JSON.stringify(payload)}`);
        }
        return;
      }

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

      if (data === "GAME_STARTING") {
        navigation.navigate("GameRoom", {
          roomId: joinedRoomId ?? "",
          isOwner: false,
          players,
        });
        return;
      }

      if (data.startsWith("ROOM_NOT_FOUND")) {
        Alert.alert("Room Not Found", "That room code doesn't exist.");
        setIsJoining(false);
        return;
      }

      if (data === "ALREADY_IN_ROOM") {
        Alert.alert("Already Joined", "You're already in this room.");
        setHasJoined(true);
        return;
      }

      if (data === "ROOM_CLOSED_BY_OWNER" || data === "Room closed by owner.") {
        Alert.alert("Room Closed", "The host closed the room.");
        ws.close();
        navigation.navigate("MyTabs");
        return;
      }
    };

    ws.onclose = () => console.log("WebSocket closed (JoinLobby)");
    setSocket(ws);
  }, []);

  const joinRoom = () => {
    const ws = socket || SocketStore.getSocket();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      Alert.alert("Error", "Connection not established yet.");
      return;
    }
    if (!roomCode.trim()) {
      Alert.alert("Error", "Enter a valid room code.");
      return;
    }
    setIsJoining(true);
    ws.send(`JOIN_GAMEROOM:${roomCode.trim()}`);
  };

  const handleToggleReady = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) ws.send("TOGGLE_READY");
  };

  const exitJoinLobby = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("LEAVE_ROOM");
      ws.close();
    }
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
      <ScreenTitleBar
        screenName="Join Game"
        onGoBackPress={() => {
          const ws = SocketStore.getSocket();
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send("LEAVE_ROOM");
            ws.close();
          }
          Alert.alert("Left Game", "You have left the room.");
          navigation.navigate("MyTabs");
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title="Join a Room"
          content={
            <View>
              {!hasJoined ? (
                <>
                  <InputField
                    label="Room Code"
                    value={roomCode}
                    onChangeText={setRoomCode}
                    placeholder="Enter room code"
                  />
                  <PrimaryButton
                    title={isJoining ? "Joining..." : "Join Game"}
                    onPress={joinRoom}
                    disabled={!roomCode.trim() || isJoining}
                  />
                </>
              ) : (
                <Text
                  style={[
                    style.subtitle,
                    {
                      color: Colors.txt,
                      textAlign: "center",
                      marginVertical: 10,
                    },
                  ]}
                >
                  Joined Room ID: {joinedRoomId}
                </Text>
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

              {hasJoined && (
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
                      ? "✅ Everyone is ready! Waiting for host to start..."
                      : "Waiting for all players to be ready..."}
                  </Text>
                </View>
              )}
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
