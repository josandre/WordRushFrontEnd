import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import JoinLobbyContent from "@/app/components/organisms/JoinLobbyContent";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { SocketStore } from "@/app/utils/socketStore";
import { useClipboard } from "@/app/utils/useClipboard";
import { WS_URL } from "@/app/utils/wsConfig";
import { Snackbar } from "@react-native-material/core";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";
import { ERROR_SNACKBAR_COLOR } from "../Auth/styles";
import styles from "./styles";

export default function JoinLobby() {
  const { copyToClipboard } = useClipboard();
  const navigation = useNavigation<AppNavigation>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [players, setPlayers] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [storedProfile, setStoredProfile] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });


  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        e.preventDefault();
        const errorSnackBar: SnackBarProps = {
          visible: true,
          message: "Do you want to leave this room?",
          color: ERROR_SNACKBAR_COLOR,
        };
        setSnackbar(errorSnackBar);
       
        navigation.dispatch(e.data.action);
      };

      navigation.addListener("beforeRemove", onBeforeRemove);
      return () => navigation.removeListener("beforeRemove", onBeforeRemove);
    }, [socket, navigation])
  );

  useEffect(() => {
    let ws: WebSocket;

    const connectAndJoin = async () => {
      const profile = await getStoredProfile();
      setStoredProfile(profile);

      ws = new WebSocket(WS_URL);
      if (!ws) return;

      ws.onopen = () => {
        SocketStore.setSocket(ws);
        setConnected(true);
      };

      ws.onmessage = async (event) => {
        const data = event.data?.trim();
        if (!data) return;
      
        if (data.startsWith("JOINED_ROOM:")) {
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

          setIsJoining(false);
          return;
        }

        if (data === "REQUEST_PROFILE_UPDATE" && profile) {
          const payload = {
            Nickname: profile.nickname ?? "Player",
            Avatar: profile.avatar ?? "default",
            Email: profile.email ?? "",
          };
          ws?.send(`UPDATE_PROFILE:${JSON.stringify(payload)}`);
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
            roomId: roomId ?? "",
            isOwner: false,
            players,
          });
          return;
        }


        if (data.startsWith("ROOM_NOT_FOUND")) {
          const errorSnackBar: SnackBarProps = {
            visible: true,
            message: "Room not found or has been closed.",
            color: ERROR_SNACKBAR_COLOR,
          };
          setSnackbar(errorSnackBar);
          setIsJoining(false);
          return;
        }

      
        if (
          data === "ROOM_CLOSED_BY_OWNER" ||
          data === "Room closed by owner."
        ) {
          const errorSnackBar: SnackBarProps = {
            visible: true,
            message: "The host closed the room.",
            color: ERROR_SNACKBAR_COLOR,
          };
          setSnackbar(errorSnackBar);
          ws?.close();
          navigation.navigate("MyTabs");
          return;
        }
      };

      ws.onclose = () => console.log("WebSocket closed (JoinLobby)");
      setSocket(ws);
    };

    connectAndJoin();
    return () => {
      if (ws) ws.close();
    };
  }, [navigation]);

  const handleJoinRoom = async () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (!roomCode.trim()) {
        const errorSnackBar: SnackBarProps = {
          visible: true,
          message: "Please enter a room code.",
          color: ERROR_SNACKBAR_COLOR,
        };
        setSnackbar(errorSnackBar);
        return;
      }
      setIsJoining(true);
      ws.send(`JOIN_GAMEROOM:${roomCode.trim()}`);
    } else {
      const errorSnackBar: SnackBarProps = {
        visible: true,
        message: "Unable to connect to server.",
        color: ERROR_SNACKBAR_COLOR,
      };
      setSnackbar(errorSnackBar);
    }
  };


  const isRoomCodeValid = () => {
    return roomCode.trim().length > 0;
  };
  
  const handleCloseRoom = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("CLOSE_GAMEROOM");
      ws.close();
    }
    const errorSnackBar: SnackBarProps = {
      visible: true,
      message: "The game room has been closed for all players.",
      color: ERROR_SNACKBAR_COLOR,
    };
    setSnackbar(errorSnackBar);
    navigation.navigate("MyTabs");
  };

  const handleToggleReady = () => {
    const ws = socket || SocketStore.getSocket();
    if (ws && ws.readyState === WebSocket.OPEN) ws.send("TOGGLE_READY");
  };

  const allReady = players.length > 0 && players.every((p) => p.IsReady);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />
      <ScreenTitleBar screenName="Join Lobby" onGoBackPress={handleCloseRoom} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <JoinLobbyContent
          roomId={roomId}
          roomCode={roomCode}
          players={players}
          storedProfile={storedProfile}
          isJoining={isJoining}
          onRoomCodeChange={setRoomCode}
          onJoinRoom={handleJoinRoom}
          onCopyRoomCode={() => copyToClipboard(roomId ?? "")}
          onToggleReady={handleToggleReady}
          onRoomCodeValid={isRoomCodeValid}
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
