import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import LobbyContent from "@/app/components/organisms/LobbyContent";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { SocketStore } from "@/app/utils/socketStore";
import { useClipboard } from "@/app/utils/useClipboard";
import { WS_URL } from "@/app/utils/wsConfig";
import { Snackbar } from "@react-native-material/core";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";
import { ERROR_SNACKBAR_COLOR, SUCCESS_SNACKBAR_COLOR } from "../Auth/styles";
import styles from "./styles";

export default function Lobby() {
  const { copyToClipboard } = useClipboard();
  const navigation = useNavigation<AppNavigation>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [storedProfile, setStoredProfile] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });


  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        e.preventDefault();
        const ws = socket || SocketStore.getSocket();
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send("CLOSE_GAMEROOM");
          ws.close();
        }
        const successSnackBar: SnackBarProps = {
          visible: true,
          message: "Lobby closed for all players",
          color: SUCCESS_SNACKBAR_COLOR,
        };
        setSnackbar(successSnackBar);
        navigation.dispatch(e.data.action);
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
        SocketStore.setSocket(ws);
        setConnected(true);

        if (isProfileReady) ws.send("CREATE_GAMEROOM");
      };

      ws.onmessage = async (event) => {
        const data = event.data?.trim();
        if (!data) return;

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

        if (data.startsWith("USER_LIST_JSON:")) {
          try {
            const json = data.substring("USER_LIST_JSON:".length);
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) setPlayers(parsed);
          } catch (err) {
             const errorSnackBar: SnackBarProps = {
              visible: true,
              message: "Parse error:",
              color: SUCCESS_SNACKBAR_COLOR,
            };
            setSnackbar(errorSnackBar);
          }
          return;
        }

        if (data === "GAME_STARTING") {
          navigation.navigate("GameRoom", {
            roomId: roomId ?? "",
            isOwner: true,
            players,
          });
          return;
        }

        if (
          data === "ROOM_CLOSED_BY_OWNER" ||
          data === "Room closed by owner."
        ) {
          const errorSnackBar: SnackBarProps = {
            visible: true,
            message: "The host closed the room",
            color: ERROR_SNACKBAR_COLOR,
          };
          setSnackbar(errorSnackBar);
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
    const successSnackBar: SnackBarProps = {
      visible: true,
      message: "Lobby closed for all players",
      color: SUCCESS_SNACKBAR_COLOR,
    };
    setSnackbar(successSnackBar);
    navigation.navigate("MyTabs");
  };

  const handleOpenConfigure = () => {
    navigation.navigate("GameConfiguration");
  }


  const allReady = players.length > 0 && players.every((p) => p.IsReady);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />
      <ScreenTitleBar screenName="Game Lobby" onGoBackPress={handleCloseRoom} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <LobbyContent
          roomId={roomId}
          players={players}
          storedProfile={storedProfile}
          isStarting={isStarting}
          allReady={allReady}
          connected={connected}
          onCopyRoomCode={() => copyToClipboard(roomId ?? "")}
          onToggleReady={handleToggleReady}
          onCloseRoom={handleCloseRoom}
          onStartGame={handleStartGame}
          onOpenConfigure={handleOpenConfigure}
        />
      </ScrollView>
      
      {snackbar.visible && (
        <Snackbar
          message={snackbar.message ?? FALLBACK_ERROR_MESSAGE}
          style={[
            styles.snackbarContainer,
            { backgroundColor: snackbar.color },
          ]}
        />
      )}
    </SafeAreaView>
  );
}
