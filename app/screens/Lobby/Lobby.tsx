import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import LobbyContent from "@/app/components/organisms/LobbyContent";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { useClipboard } from "@/app/utils/useClipboard";
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
  const [players, setPlayers] = useState<RoomPlayerSnapshot[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [storedProfile, setStoredProfile] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  const route = useRoute();
  const { isOwner, roomId } = route.params as RouteParams;

  // Called when the room info is updated from the server
  const onRoomInfoRequested = (data: any): void => {
    var roomData = JSON.parse(data.JsonData) as RoomData;
    setPlayers(roomData.Players);
  }

  const onRoomClosed = (data: any): void => {
    const errorSnackBar: SnackBarProps = {
      visible: true,
      message: "The host closed the room",
      color: ERROR_SNACKBAR_COLOR,
    };

    setSnackbar(errorSnackBar);
    navigation.navigate("MyTabs");
  }

  const onGameStarted = (data: any): void => {
    navigation.navigate("GameRoom", {
      roomId: roomId
    })
  }

  useEffect(() => {
    // Web Socket callbacks setup
    webSocketService.connect();
    webSocketService.addCallbacks("GAME_ROOM|DATA_UPDATED", onRoomInfoRequested);
    webSocketService.addCallbacks("GAME_ROOM|CLOSED", onRoomClosed);
    webSocketService.addCallbacks("GAME_ROOM|GAME_STARTED", onGameStarted);

    // When joining the lobby, inmediatelly request the room data to update the visuals
    webSocketService.sendMessage({
      Type: "GAME_ROOM|REQUEST_DATA",
      JsonData: "{}"
    });

    // Used to retrieve the stored profile, so it is acccesible from other subcomponents
    const setup = async () => {
      const profile = await getStoredProfile();
      setStoredProfile(profile);
    }

    setup();
  }, []);

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
      JsonData: "{}"
    });
  };

  const handleStartGame = () => {
    // Notify the server about the game session start
    // Then wait for the confirmation for all the players that are in the GameRoom so that the first round can start
    // When all the players are ready
    webSocketService.sendMessage({
      Type: "GAME_ROOM|START_GAME",
      JsonData: "{}"
    });

    setIsStarting(true);
  };

  const handleGoBack = () => {
    webSocketService.sendMessage({
      Type: "GAME_ROOM|LEAVE",
      JsonData: "{}"
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
    if (roomId) {
      navigation.navigate("GameConfiguration", {
        roomId: roomId,
      });
    }
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
