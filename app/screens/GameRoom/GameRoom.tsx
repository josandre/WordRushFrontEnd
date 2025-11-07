import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
  useWindowDimensions,
} from "react-native";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Snackbar } from "@react-native-material/core";
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from "../Auth/constants";
import { ERROR_SNACKBAR_COLOR, SUCCESS_SNACKBAR_COLOR } from "../Auth/styles";
import styles from "./styles";

import webSocketService from "@/app/services/webSocketService";
import GameManager from "@/app/StorageManager/GameManager/GameManager";

import ContentCard from "@/app/components/atoms/ContentCard";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import ScreenTitleBar from "@/app/components/molecules/ScreenTitleBar";
import GameRoomTitleBar from "@/app/components/molecules/GameRoomTitleBar";

import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
import useProfileUser from "@/app/screens/UserProfile/services/useProfileUser";
import avatars, { getAvatarImage } from "@/assets/avatars";

// 🖼️ Category icons
import personIcon from "@/assets/icons/person.png";
import globeIcon from "@/assets/icons/globe.png";
import foodIcon from "@/assets/icons/food.png";
import animalIcon from "@/assets/icons/animal.png";
import objectIcon from "@/assets/icons/object.png";

type GameRoomRouteParams = {
  roomId: string;
  roomData?: any;
};

enum SessionState {
  JOINING,
  WAITING_ROUND_START,
  IN_ROUND,
  IN_ROUND_EVALUATION,
  IN_ROUND_RESULTS,
  IN_GAME_RESULTS,
}

const SIMULATE_LATENCY: boolean = true;

export default function GameRoom() {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute();
  const { roomId } = route.params as GameRoomRouteParams;

  const [categories, setCategories] = useState<string[]>([]);
  const [roundLetter, setRoundLetter] = useState<string>("A");
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.JOINING,
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // 🔹 User Profile (for GameRoomTitleBar)
  const { getProfileUser, pdata } = useProfileUser();
  const manager = isWeb ? ProfileWebTokenManager : ProfileMobileTokenManager;
  const avatarSource = getAvatarImage(pdata?.avatar) || avatars["default"];

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const stored = await manager.getUserProfile();
        if (stored?.email) {
          await getProfileUser({ userEmail: stored.email });
        }
      };
      loadProfile();
    }, [getProfileUser]),
  );

  const categoryIcons: Record<string, any> = {
    Name: personIcon,
    Country: globeIcon,
    Food: foodIcon,
    Animal: animalIcon,
    Thing: objectIcon,
  };

  // --- Original GameRoom Logic (unchanged) ---
  const onRoomClosed = (): void => {
    setSnackbar({
      visible: true,
      message: "The host closed the room",
      color: ERROR_SNACKBAR_COLOR,
    });
    navigation.navigate("MyTabs");
  };

  const onRoundStarted = (): void => setSessionState(SessionState.IN_ROUND);

  const onStop = (): void => {
    const jsonData = {
      Answers: JSON.parse(JSON.stringify([...answers])),
    };
    webSocketService.sendMessage({
      Type: "GAME_SESSION|SEND_ROUND_ANSWERS",
      JsonData: JSON.stringify(jsonData),
    });
    setSessionState(SessionState.IN_ROUND_EVALUATION);
  };

  const handleGoBack = (): void => {
    webSocketService.sendMessage({
      Type: "GAME_ROOM|LEAVE",
      JsonData: "{}",
    });
    setSnackbar({
      visible: true,
      message: "Lobby closed for all players",
      color: SUCCESS_SNACKBAR_COLOR,
    });
    navigation.navigate("MyTabs");
  };

  const handleStopPress = (): void => {
    webSocketService.sendMessage({
      Type: "GAME_SESSION|STOP",
      JsonData: "{}",
    });
    setSessionState(SessionState.IN_ROUND_EVALUATION);
  };

  const onAnswerChange = (index: number, value: string) => {
    if (sessionState != SessionState.IN_ROUND) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const isStopAvailable = (): boolean =>
    answers.every(
      (a) => a.trim().length > 1 && a.toUpperCase().startsWith(roundLetter),
    );

  useEffect(() => {
    const setup = async () => {
      const gm = new GameManager();
      const gameData = await gm.getGameRoomData();
      console.log(gameData);
      setCategories(["Name", "Country", "Food", "Animal", "Thing"]);
      setAnswers(["", "", "", "", ""]);
      if (SIMULATE_LATENCY) {
        const delay = Math.floor(Math.random() * 1000) + 1000;
        await new Promise((r) => setTimeout(r, delay));
      }
      webSocketService.sendMessage({
        Type: "GAME_SESSION|READY_FOR_NEXT_ROUND",
        JsonData: "{}",
      });
    };

    webSocketService.connect();
    webSocketService.addCallbacks("GAME_ROOM|CLOSED", onRoomClosed);
    webSocketService.addCallbacks("GAME_SESSION|ROUND_STARTED", onRoundStarted);
    webSocketService.addCallbacks("GAME_SESSION|ON_STOP", onStop);

    if (sessionState === SessionState.JOINING) {
      setSessionState(SessionState.WAITING_ROUND_START);
      setup();
    }
  }, [answers]);

  // --- Card Layout (unchanged except for minWidth fix) ---
  const renderCards = () => {
    if (!isWeb) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, gap: 16 }}
        >
          {categories.map((category, index) => (
            <View
              key={category}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 14,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Image
                source={categoryIcons[category]}
                style={{ width: 60, height: 60, marginBottom: 10 }}
                resizeMode="contain"
              />
              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}
              >
                {category}
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#F4F3FF",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#D1C4E9",
                  width: "90%",
                  height: 38,
                  paddingHorizontal: 10,
                  textAlign: "center",
                }}
                placeholder={`Enter a ${category.toLowerCase()}...`}
                placeholderTextColor="#aaa"
                value={answers[index]}
                onChangeText={(v) => onAnswerChange(index, v)}
              />
            </View>
          ))}
        </ScrollView>
      );
    }

    // 💻 Web
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          padding: 20,
          width: "100%",
        }}
      >
        {categories.map((category, index) => (
          <View
            key={category}
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              paddingVertical: 24,
              paddingHorizontal: 18,
              alignItems: "center",
              justifyContent: "flex-start",
              width: Math.min(width * 0.18, 260),
              minWidth: 190,
              height: 250,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Image
              source={categoryIcons[category]}
              style={{ width: 80, height: 80, marginBottom: 14 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 12,
                color: "#2E2E2E",
              }}
            >
              {category}
            </Text>
            <TextInput
              style={{
                backgroundColor: "#F4F3FF",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#D1C4E9",
                width: "85%",
                height: 42,
                paddingHorizontal: 10,
                textAlign: "center",
                fontSize: 15,
              }}
              placeholder={`Enter a ${category.toLowerCase()}...`}
              placeholderTextColor="#aaa"
              value={answers[index]}
              onChangeText={(v) => onAnswerChange(index, v)}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    switch (sessionState) {
      case SessionState.JOINING:
        return (
          <ContentCard
            title="Joining Game Session..."
            content={<ActivityIndicator size="large" color={Colors.primary} />}
          />
        );
      case SessionState.WAITING_ROUND_START:
        return (
          <ContentCard
            title="Get ready! The round will start soon..."
            content={<ActivityIndicator size="large" color={Colors.primary} />}
          />
        );
      case SessionState.IN_ROUND_EVALUATION:
        return (
          <ContentCard
            title="A STOP has been triggered, evaluating answers..."
            content={<ActivityIndicator size="large" color={Colors.primary} />}
          />
        );
      case SessionState.IN_ROUND:
        return (
          <ContentCard
            title=""
            content={
              <View>
                {renderCards()}
                <PrimaryButton
                  title="STOP!"
                  onPress={handleStopPress}
                  disabled={!isStopAvailable()}
                  loading={false}
                />
              </View>
            }
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />

      {/* ✅ NEW: GameRoomTitleBar (only addition) */}
      <View style={{ marginTop: 20 }}>
        <GameRoomTitleBar username={pdata?.nickname} avatar={avatarSource} />
      </View>

      <ScreenTitleBar
        screenName={"Round Letter: " + roundLetter.toUpperCase()}
        onGoBackPress={handleGoBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>{renderContent()}</View>
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
