import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, ScrollView, Text } from "react-native";
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

import { useRoute } from '@react-navigation/native';
import webSocketService from "@/app/services/webSocketService";

type RouteParams = { 
  isOwner: boolean; 
  roomId: string; 
};

type RoomPlayerSnapshot = {
    UserId: string;
    Nickname: string;
    Avatar: string;
    IsReady: boolean;
    isOwner: boolean;
}

type RoomData = {
  Players: RoomPlayerSnapshot[]
}

export default function Lobby() {
  const { copyToClipboard } = useClipboard();
  const navigation = useNavigation<AppNavigation>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<RoomPlayerSnapshot[]>([]);
  const [connected, setConnected] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [storedProfile, setStoredProfile] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  const route = useRoute();
  const { isOwner, roomId } = route.params as RouteParams;

  // Called when the room info is updated from the server
  function onRoomInfoRequested(data: any) {
    var roomData = JSON.parse(data.JsonData) as RoomData;
    setPlayers(roomData.Players);
  }

  function onRoomClosed(data: any) {
    const errorSnackBar: SnackBarProps = {
      visible: true,
      message: "The host closed the room",
      color: ERROR_SNACKBAR_COLOR,
    };

    setSnackbar(errorSnackBar);
    navigation.navigate("MyTabs");
  }

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
    // Web Socket callbacks setup
    webSocketService.connect();
    webSocketService.addCallbacks("GAME_ROOM|DATA_UPDATED", onRoomInfoRequested);
    webSocketService.addCallbacks("GAME_ROOM|CLOSED", onRoomClosed);

    // When joining the lobby, inmediatelly request the room data to update the visuals
    webSocketService.sendMessage({
      Type: "GAME_ROOM|REQUEST_DATA",
      Data: {}
    });

    // Used to retrieve the stored profile, so it is acccesible from other subcomponents
    const setup = async () => {
      const profile = await getStoredProfile();
      setStoredProfile(profile);
    }

    setup();
    return () => {
      webSocketService.removeCallbacks("GAME_ROOM|DATA_UPDATED", onRoomInfoRequested);
      webSocketService.removeCallbacks("GAME_ROOM|CLOSED", onRoomClosed);
    };
    
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

  const handleCopyToClipboard = () => {
    copyToClipboard(roomId ?? "");

    const successSnackBar: SnackBarProps = {
      visible: true,
      message: "Game Room Code copied",
      color: SUCCESS_SNACKBAR_COLOR,
    };
    setSnackbar(successSnackBar);
  }

  const handleToggleReady = () => {
    webSocketService.sendMessage({
      Type: "GAME_ROOM|TOGGLE_READY",
      Data: {}
    });
  };

  const handleStartGame = () => {
    // TODO:
    const ws = socket || SocketStore.getSocket();
    if (ws && connected && roomId) {
      setIsStarting(true);
      ws.send("START_GAME");
    }
  };

  const handleGoBack = () => {
    webSocketService.sendMessage({
      Type: "GAME_ROOM|LEAVE",
      Data: {}
    });

    const successSnackBar: SnackBarProps = {
      visible: true,
      message: "Lobby closed for all players",
      color: SUCCESS_SNACKBAR_COLOR,
    };
    setSnackbar(successSnackBar);
    navigation.navigate("MyTabs");
  };

  const handleOpenConfigure = () => {
    navigation.navigate("GameConfiguration", {
      roomId: roomId,
    });
  }

  const allReady = players.length > 1 && players.every((p) => p.IsReady);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />
      <ScreenTitleBar screenName="Game Lobby" onGoBackPress={handleGoBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <LobbyContent
          roomId={roomId}
          isOwner={isOwner}
          players={players}
          storedProfile={storedProfile}
          isStarting={isStarting}
          allReady={allReady}
          onCopyRoomCode={handleCopyToClipboard}
          onToggleReady={handleToggleReady}
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
