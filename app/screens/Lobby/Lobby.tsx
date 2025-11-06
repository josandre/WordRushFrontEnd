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
import { GameRoomData, WebSocketRoomCreatedEvent } from "../Home/constants";
import GameManager from "@/app/StorageManager/GameManager/GameManager";

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
  async function onRoomInfoRequested(data: any) {
    try {
      const jsonData = JSON.parse(data.JsonData);
      
      // Update players if present
      if (jsonData.Players) {
        let roomData = jsonData as RoomData;
        setPlayers(roomData.Players);
      }
      
      // Check if Settings are included in the broadcast (settings updated)
      if (jsonData.Settings) {
        const gameManager = new GameManager();
        
        // Load existing room data to preserve GameRoomID and CategoryType
        const existingRoomData = await gameManager.getGameRoomData();
        
        if (existingRoomData) {
          // Merge new Settings with existing room data
          const updatedRoomData: GameRoomData = {
            GameRoomID: existingRoomData.GameRoomID, // Preserve existing GameRoomID
            Settings: jsonData.Settings, // Use new Settings from broadcast
            CategoryType: existingRoomData.CategoryType // Preserve existing CategoryType
          };
          
          await gameManager.saveGameRoomData(updatedRoomData);
          console.log('Game room data updated from DATA_UPDATED - Settings:', jsonData.Settings);
        } else {
          // If no existing data, we still need GameRoomID and CategoryType
          // Try to get GameRoomID from route params or use roomId from broadcast if available
          if (jsonData.GameRoomID || roomId) {
            const roomData: GameRoomData = {
              GameRoomID: jsonData.GameRoomID || roomId,
              Settings: jsonData.Settings,
              CategoryType: jsonData.CategoryType || {
                id: 0,
                name: "Default",
                CategoryColumns: []
              }
            };
            await gameManager.saveGameRoomData(roomData);
            console.log('Game room data saved from DATA_UPDATED (no existing data)');
          }
        }
      }
    } catch (error) {
      console.error('Error handling room data update:', error);
      // Fallback to original behavior
      try {
        let roomData = JSON.parse(data.JsonData) as RoomData;
        if (roomData.Players) {
          setPlayers(roomData.Players);
        }
      } catch (e) {
        console.error('Error parsing room data:', e);
      }
    }
  }

  // Called when the backend broadcasts room data (including settings) to all players
  // This happens when settings are updated, so all players get the latest room data
  async function onRoomDataBroadcast(data: WebSocketRoomCreatedEvent) {
    try {
      const jsonData = JSON.parse(data.JsonData);
      
      const gameManager = new GameManager();
      
      // Load existing room data to preserve GameRoomID and CategoryType
      const existingRoomData = await gameManager.getGameRoomData();
      
      // Check if this is full GameRoomData or just Settings update
      if (jsonData.GameRoomID && jsonData.Settings && jsonData.CategoryType) {
        // Full room data - use it directly
        const roomData: GameRoomData = {
          GameRoomID: jsonData.GameRoomID,
          Settings: jsonData.Settings,
          CategoryType: jsonData.CategoryType
        };
        
        await gameManager.saveGameRoomData(roomData);
        console.log('Game room data updated from broadcast (full data):', roomData);
      } else if (jsonData.Settings && existingRoomData) {
        // Just Settings update - merge with existing data
        const updatedRoomData: GameRoomData = {
          GameRoomID: existingRoomData.GameRoomID,
          Settings: jsonData.Settings,
          CategoryType: existingRoomData.CategoryType
        };
        
        await gameManager.saveGameRoomData(updatedRoomData);
        console.log('Game room data updated from broadcast - Settings:', jsonData.Settings);
      }
      
      // Also update players if the broadcast includes player data
      if (jsonData.Players) {
        setPlayers(jsonData.Players);
      }
    } catch (error) {
      console.error('Error updating game room data from broadcast:', error);
    }
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
    
    // Listen for room data broadcasts (when settings are updated)
    // Note: The message type may need to be adjusted based on what the backend actually sends
    // Common patterns: "GAME_ROOM|ROOM_DATA_BROADCAST", "GAME_ROOM|SETTINGS_UPDATED", "GAME_ROOM|ROOM_UPDATED"
    // If the backend reuses "GAME_ROOM|DATA_UPDATED" but includes full room data, we can handle it there too
    webSocketService.addCallbacks("GAME_ROOM|ROOM_DATA_BROADCAST", onRoomDataBroadcast);

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
