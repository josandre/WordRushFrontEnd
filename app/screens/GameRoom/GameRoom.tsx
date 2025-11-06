import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StatusBar, View, Text, TextInput, ActivityIndicator } from "react-native";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";

import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import GameRoomContent from "@/app/components/organisms/GameRoom";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import { Snackbar } from "@react-native-material/core";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";
import { ERROR_SNACKBAR_COLOR, SUCCESS_SNACKBAR_COLOR } from "../Auth/styles";
import styles from "./styles";

import webSocketService from "@/app/services/webSocketService";
import GameManager from "@/app/StorageManager/GameManager/GameManager";

import ContentCard from "@/app/components/atoms/ContentCard";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import { useFocusEffect } from "expo-router";


type GameRoomRouteParams = {
  roomId: string;
  roomData?: any; //TODO change this to the type
};

enum SessionState {
  JOINING,
  WAITING_ROUND_START,
  IN_ROUND,
  IN_ROUND_EVALUATION,
  IN_ROUND_RESULTS,
  IN_GAME_RESULTS
}

// DEBUG SYMBOLS
const SIMULATE_LATENCY: boolean = true; // USEFUL FOR SIMULATING LATENCY DURING CERTAIN STATES

export default function GameRoom() {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute();
  const { roomId, roomData } = route.params as GameRoomRouteParams;

  const [categories, setCategories] = useState<string[]>([]);
  const [roundLetter, setRoundLetter] = useState<string>("A");
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.JOINING);
  const [answers, setAnswers] = useState<string[]>([]);

  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  // Called when the host decides to close the room
  const onRoomClosed = (data: any): void => {
    const errorSnackBar: SnackBarProps = {
      visible: true,
      message: "The host closed the room",
      color: ERROR_SNACKBAR_COLOR,
    };

    setSnackbar(errorSnackBar);
    navigation.navigate("MyTabs");
  }

  const onRoundStarted = (data: any): void => {
    // TODO: Update the round letter based on server response

    setSessionState(SessionState.IN_ROUND);
  }

  // Called when the server requests all the player answers
  const onStop = (data: any): void => {
    // Send the current answers to the server, so it can proceed with the evaluation
    const registeredAnswers = [...answers];

    const jsonData = {
      Answers: JSON.parse(JSON.stringify(registeredAnswers))
    }

    webSocketService.sendMessage({
      Type: "GAME_SESSION|SEND_ROUND_ANSWERS",
      JsonData: JSON.stringify(jsonData)
    });

    setSessionState(SessionState.IN_ROUND_EVALUATION);
  }

  // Called when the player wants to go to the previous screen
  const handleGoBack = (): void => {
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
  }

  // This user has just pressed the STOP button
  const handleStopPress = (): void => {
    webSocketService.sendMessage({
      Type: "GAME_SESSION|STOP",
      JsonData: "{}"
    });

    setSessionState(SessionState.IN_ROUND_EVALUATION);
  }

  // Called everytime an answer input text is updated
  const onAnswerChange = (index: number, value: string) => {
    if (sessionState != SessionState.IN_ROUND) {
      return;
    }

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  // Evaluates every answer to determine if the STOP button is available or not
  const isStopAvailable = (): boolean => {
    let isAvailable: boolean = true;

    answers.forEach((answer) => {
      // If already found an invalid answer, get out of the loop
      if (!isAvailable) {
        return;
      }

      // The answer is empty or one character only
      if (answer.trim().length <= 1) {
        isAvailable = false;
      }

      // The answer doesn't start with the round letter
      if (!answer.toUpperCase().startsWith(roundLetter)) {
        isAvailable = false;
      }
    });

    return isAvailable;
  }

  useEffect(() => {
    const setup = async () => {
      const gameManager = new GameManager();
      const gameData = await gameManager.getGameRoomData();

      // TODO: Update categories here from the data in local storage, for now just force it
      let totalCategories: number = 4;
      setCategories(["Name", "Country", "Food", "Thing"]);
      setAnswers(new Array(totalCategories).fill(""));

      // Wait a random number of seconds before confirming the ready state
      if (SIMULATE_LATENCY) {
        const delay = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        await new Promise((r) => setTimeout(r, delay));
      }

      webSocketService.sendMessage({
        Type: "GAME_SESSION|READY_FOR_NEXT_ROUND",
        JsonData: "{}"
      });
    }

    // Web Socket callbacks setup
    webSocketService.connect();
    webSocketService.addCallbacks("GAME_ROOM|CLOSED", onRoomClosed);
    webSocketService.addCallbacks("GAME_SESSION|ROUND_STARTED", onRoundStarted);
    webSocketService.addCallbacks("GAME_SESSION|ON_STOP", onStop);

    // When joining the game session (First time), inmediatelly notify the server about it, so the 
    // Next round can start when all players are connected
    if (sessionState == SessionState.JOINING) {
      setSessionState(SessionState.WAITING_ROUND_START);
      setup();
    }
  }, [answers])

  const renderContent = () => {
    switch (sessionState) {
      case SessionState.JOINING:
        return (
          <ContentCard
            title="Joining Game Session..."
            content={
              <View>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            }
          />
        );
      case SessionState.WAITING_ROUND_START:
        return (
          <ContentCard
            title="Get ready! The round will start soon..."
            content={
              <View>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            }
          />
        );
      case SessionState.IN_ROUND_EVALUATION:
        return (
          <ContentCard
            title="A STOP has been triggered, evaluating answers..."
            content={
              <View>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            }
          />
        );
      case SessionState.IN_ROUND:
        return (
          <ContentCard
            title=""
            content={
              <View>
                <View>
                  {categories.length > 0 ? (
                    categories.map((category, categoryIndex) => {
                      return (
                        <View key={category}>
                          <Text style={[style.subtitle, { color: Colors.txt, flex: 1, marginTop: 10, marginBottom: 10 }]}>
                            {category}
                          </Text>

                          <TextInput
                            style={style.txtinput}
                            value={answers[categoryIndex]}
                            onChangeText={(value) => onAnswerChange(categoryIndex, value)}
                          />
                        </View>

                      )
                    })
                  ) : (
                    <View>
                    </View>
                  )}
                </View>

                <View>
                  <PrimaryButton
                    title="STOP!"
                    onPress={handleStopPress}
                    disabled={!isStopAvailable()}
                    loading={false}
                  />
                </View>
              </View>
            }
          />
        );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />
      <ScreenTitleBar screenName={"Round Letter: " + roundLetter.toUpperCase()} onGoBackPress={handleGoBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          {renderContent()}
        </View>
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
