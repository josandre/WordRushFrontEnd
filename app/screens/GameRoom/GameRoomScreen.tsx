import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "@/app/theme/color";
import style from "@/app/theme/style";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import PlayerCard from "@/app/components/molecules/PlayerCard";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { SocketStore } from "@/app/utils/socketStore";

type GameRoomRouteParams = {
  roomId: string;
  isOwner: boolean;
  players?: any[];
};

export default function GameRoom() {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute();
  const {
    roomId,
    isOwner,
    players: initialPlayers,
  } = route.params as GameRoomRouteParams;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<any[]>(initialPlayers ?? []);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const ws = SocketStore.getSocket();
    if (!ws) {
      Alert.alert("Connection Lost", "Returning to home screen.");
      navigation.navigate("MyTabs");
      return;
    }

    setSocket(ws);

    // Load local player info
    (async () => {
      const stored = await getStoredProfile();
      setUserProfile(stored);
    })();

    ws.onmessage = (event: MessageEvent) => {
      const data = event.data;
      console.log("GameRoom message:", data);

      if (data.startsWith("USER_LIST_JSON:")) {
        try {
          const json = data.replace("USER_LIST_JSON:", "");
          const parsed = JSON.parse(json);
          setPlayers(parsed);
        } catch (err) {
          console.error("Error parsing user list:", err, data);
        }
      } else if (data === "ROOM_CLOSED_BY_OWNER") {
        Alert.alert("Room Closed", "The host closed the room.");
        navigation.navigate("MyTabs");
      }
    };

    ws.onclose = () => console.log("WebSocket closed (GameRoom)");
    return () => {
      ws.close();
    };
  }, []);

  function exitGameRoom() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("LEAVE_ROOM");
      socket.close();
    }
    navigation.navigate("MyTabs");
  }

  const myPlayer = players.find(
    (p) =>
      p.Email &&
      userProfile?.email &&
      p.Email.toLowerCase() === userProfile.email.toLowerCase()
  );

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title=""
          content={
            <View>
              <Text style={[style.subtitle, { color: Colors.txt }]}>
                Room ID: {roomId}
              </Text>
              <Text
                style={[style.m16, { color: Colors.txt, marginBottom: 15 }]}
              >
                {isOwner ? "You are the host" : "Waiting for host to start..."}
              </Text>

              {/* ✅ Display Current User Info */}
              {myPlayer ? (
                <PlayerCard
                  nickname={myPlayer.Nickname}
                  avatar={myPlayer.Avatar}
                  isReady={myPlayer.IsReady}
                  isOwner={myPlayer.IsOwner}
                  readyLabel={myPlayer.IsReady ? "Ready" : "Not Ready"}
                  showReadyButton={false}
                />
              ) : userProfile ? (
                <PlayerCard
                  nickname={userProfile.nickname ?? "You"}
                  avatar={userProfile.avatar ?? "default"}
                  isReady={false}
                  isOwner={isOwner}
                  readyLabel={"You"}
                  showReadyButton={false}
                />
              ) : null}

              {/* ✅ Other players */}
              <View style={{ marginTop: 20 }}>
                {players
                  .filter(
                    (p) =>
                      !userProfile?.email ||
                      p.Email?.toLowerCase() !== userProfile.email.toLowerCase()
                  )
                  .map((p) => (
                    <PlayerCard
                      key={p.UserId}
                      nickname={p.Nickname}
                      avatar={p.Avatar}
                      isReady={p.IsReady}
                      isOwner={p.IsOwner}
                      readyLabel={p.IsReady ? "Ready" : "Not Ready"}
                      showReadyButton={false}
                    />
                  ))}
              </View>

              {/* ✅ End Game for Host */}
              {isOwner && (
                <View style={{ marginTop: 20 }}>
                  <PrimaryButton title="End Game" onPress={exitGameRoom} />
                </View>
              )}
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
