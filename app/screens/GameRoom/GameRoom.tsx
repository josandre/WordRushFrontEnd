import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import GameRoomContent from "@/app/components/organisms/GameRoom";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../UserProfile/services/usetStoredProfile";
import { SocketStore } from "@/app/utils/socketStore";
import { Snackbar } from "@react-native-material/core";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";
import { ERROR_SNACKBAR_COLOR } from "../Auth/styles";
import styles from "./styles";

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
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  useEffect(() => {
    const ws = SocketStore.getSocket();
    if (!ws) {
      const errorSnackBar: SnackBarProps = {
        visible: true,
        message: "Connection Lost. Returning to home screen.",
        color: ERROR_SNACKBAR_COLOR,
      };
      setSnackbar(errorSnackBar);
      navigation.navigate("MyTabs");
      return;
    }

    setSocket(ws);

  
    (async () => {
      const stored = await getStoredProfile();
      setUserProfile(stored);
    })();

    ws.onmessage = (event: MessageEvent) => {
      const data = event.data;

      if (data.startsWith("USER_LIST_JSON:")) {
        try {
          const json = data.replace("USER_LIST_JSON:", "");
          const parsed = JSON.parse(json);
          setPlayers(parsed);
        } catch (err) {
            const errorSnackBar: SnackBarProps = {
            visible: true,
            message: "Error parsing the list",
            color: ERROR_SNACKBAR_COLOR,
            };

            setSnackbar(errorSnackBar);
        }
      } else if (data === "ROOM_CLOSED_BY_OWNER") {
        const errorSnackBar: SnackBarProps = {
          visible: true,
          message: "The host closed the room.",
          color: ERROR_SNACKBAR_COLOR,
        };
        setSnackbar(errorSnackBar);
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

  function handleConfigureGame() {
    navigation.navigate("GameConfiguration", {
      roomId: roomId,
    });
  }

  const myPlayer = players.find(
    (p) =>
      p.Email &&
      userProfile?.email &&
      p.Email.toLowerCase() === userProfile.email.toLowerCase()
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <GameRoomContent
          roomId={roomId}
          isOwner={isOwner}
          players={players}
          myPlayer={myPlayer}
          userProfile={userProfile}
          onEndGame={exitGameRoom}
          onConfigure={handleConfigureGame}
        />
      </ScrollView>
      
      {snackbar.visible && (
        <Snackbar
          message={snackbar.message ?? FALLBACK_ERROR_MESSAGE}
          style={[
            styles.snackbarContainer,
            styles.snackbar,
            { backgroundColor: snackbar.color },
          ]}
        />
      )}
    </SafeAreaView>
  );
}
