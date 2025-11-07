import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import JoinLobbyContent from "@/app/components/organisms/JoinLobbyContent";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { getStoredProfile } from "../../screens/UserProfile/services/usetStoredProfile";
import { Snackbar } from "@react-native-material/core";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";
import { ERROR_SNACKBAR_COLOR } from "../Auth/styles";
import styles from "./styles";
import webSocketService from "@/app/services/webSocketService";
import { GameRoomData, WebSocketRoomCreatedEvent } from "../Home/constants";
import GameManager from "@/app/StorageManager/GameManager/GameManager";

export default function JoinLobby() {
  const navigation = useNavigation<AppNavigation>();
  const [roomCode, setRoomCode] = useState<string>("");
  const [isJoining, setIsJoining] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  async function onJoinedRoom(data: WebSocketRoomCreatedEvent) {
    const jsonData = JSON.parse(data.JsonData) as GameRoomData;

    console.log("JAC", jsonData);
    const roomData: GameRoomData = {
      GameRoomID: jsonData.GameRoomID,
      Settings: jsonData.Settings,
      CategoryType: jsonData.CategoryType,
    };

    const gameManager = new GameManager();

    try {
      await gameManager.saveGameRoomData(roomData);
      setIsJoining(false);

      // The player is logically added to the room in the server
      // So just navigate so the lobby screen and see the room info
      // The lobby screen has a request for the room data, so it will automatically refresh the info for all the users in the room
      navigation.navigate("Lobby", {
        isOwner: false,
        roomId: jsonData.GameRoomID,
        roomData: roomData,
      });
    } catch (error) {
      setIsJoining(false);
      const errorSnackBar: SnackBarProps = {
        visible: true,
        message: "Error saving game room data. Please try again.",
        color: ERROR_SNACKBAR_COLOR,
      };
      setSnackbar(errorSnackBar);
    }
  }

  function onJoinedNonExistingRoom() {
    const errorSnackBar: SnackBarProps = {
      visible: true,
      message: "Invalid Room Code: The room couldn't be found.",
      color: ERROR_SNACKBAR_COLOR,
    };
    setSnackbar(errorSnackBar);
    setIsJoining(false);
  }

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
      return () => {
        navigation.removeListener("beforeRemove", onBeforeRemove);
      };
    }, []),
  );

  useEffect(() => {
    webSocketService.connect();
    webSocketService.addCallbacks("GAME_ROOM|JOINED", onJoinedRoom);
    webSocketService.addCallbacks(
      "GAME_ROOM|JOINED_NON_EXISTING_ROOM",
      onJoinedNonExistingRoom,
    );
  });

  const handleJoinRoom = async () => {
    const profile = await getStoredProfile();

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

    const jsonData = {
      PlayerProfile: {
        Nickname: profile?.nickname,
        Avatar: profile?.avatar,
        Email: profile?.email,
      },
      RoomID: roomCode,
    };

    webSocketService.sendMessage({
      Type: "GAME_ROOM|JOIN",
      JsonData: JSON.stringify(jsonData),
    });
  };

  const isRoomCodeValid = () => {
    return roomCode.trim().length > 0;
  };

  const handleGoBack = () => {
    navigation.navigate("MyTabs");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />
      <ScreenTitleBar screenName="Join Lobby" onGoBackPress={handleGoBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <JoinLobbyContent
          roomCode={roomCode}
          isJoining={isJoining}
          onRoomCodeChange={setRoomCode}
          onJoinRoom={handleJoinRoom}
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
