import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  View,
  Text,
  TextInput,
  Image,
  Platform,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import WordRushSpinner from "@/app/components/atoms/WordRushSpinner";
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

import webSocketService, {
  RoundResultsPayload,
} from "@/app/services/webSocketService";
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

// Icon library used for hint button
import Icon from "react-native-vector-icons/Ionicons";

// 🖼️ Category icons
import personIcon from "@/assets/icons/person.png";
import globeIcon from "@/assets/icons/globe.png";
import foodIcon from "@/assets/icons/food.png";
import animalIcon from "@/assets/icons/animal.png";
import colorIcon from "@/assets/icons/color.png";
import { GameRoomData } from "../Home/constants";

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

// Structure of the hint response coming from the backend.
// Contains the generated hint text and the number of tokens remaining for the player.
type HintResponsePayload = {
  hint: string;
  tokensLeft: number;
};

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
  const [notifiedIsReady, setNotifiedIsReady] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Hint system state
  // Number of hint tokens the player has remaining in the current game.  This
  // value is initialized from the server settings when the component mounts
  // and is updated whenever a hint response is received from the backend.
  const [hintTokensLeft, setHintTokensLeft] = useState<number>(3);
  // The actual hint text returned by the backend.  This will be displayed
  // inside a modal when a hint is requested.
  const [currentHint, setCurrentHint] = useState<string>("");
  // Controls whether the hint modal is visible.
  const [hintModalVisible, setHintModalVisible] = useState<boolean>(false);

  // 🆕 New: Store full round results payload
  const [roundResults, setRoundResults] = useState<RoundResultsPayload | null>(
    null,
  );

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // 🔹 User Profile (for GameRoomTitleBar)
  const { getProfileUser, pdata } = useProfileUser();
  const manager = isWeb ? ProfileWebTokenManager : ProfileMobileTokenManager;
  const avatarSource = getAvatarImage(pdata?.avatar) || avatars["default"];
  // 🎞️ Animation for round results
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // When round results state changes, fade in the section
  useEffect(() => {
    if (sessionState === SessionState.IN_ROUND_RESULTS) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sessionState]);

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
    "Country or City": globeIcon,
    "Fruit or Food": foodIcon,
    Animal: animalIcon,
    Color: colorIcon,
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

  /**
   * Handles the server's hint response. The backend sends back both the hint
   * text and the number of tokens remaining.  Parse the incoming payload
   * safely, update our state accordingly, and then display the hint in
   * a modal. If parsing fails, the response is ignored.
   */
  const onHintResponse = (data: any): void => {
    try {
      // Determine if the backend wrapped the payload in a JsonData string
      const jsonString =
        typeof data === "string"
          ? data
          : typeof data?.JsonData === "string"
            ? data.JsonData
            : null;
      let payload: HintResponsePayload | null = null;
      if (jsonString) {
        payload = JSON.parse(jsonString) as HintResponsePayload;
      } else if (data && typeof data === "object") {
        payload = {
          hint: (data.hint as string) ?? "",
          tokensLeft:
            typeof data.tokensLeft === "number"
              ? (data.tokensLeft as number)
              : hintTokensLeft,
        };
      }
      if (payload) {
        setCurrentHint(payload.hint || "");
        if (typeof payload.tokensLeft === "number") {
          setHintTokensLeft(payload.tokensLeft);
        }
        setHintModalVisible(true);
      }
    } catch (err) {
      console.warn("Failed to parse HINT_RESPONSE payload", err);
    }
  };

  const onRoundStarted = (data: any): void => {
    const jsonData = JSON.parse(data.JsonData);
    if (jsonData.RoundLetter) {
      setRoundLetter(jsonData.RoundLetter);
    }
    setNotifiedIsReady(false);
    setAnswers(Array(categories?.length).fill(""));
    setSessionState(SessionState.IN_ROUND);
  };

  // ✅ Fixed and normalized: Handle scored round results
  const onRoundResultReceived = (data: any): void => {
    console.log("----ROUND DATA: ", data);

    try {
      // Detect if the WebSocket message contains JsonData (envelope)
      const jsonString =
        typeof data === "string"
          ? data
          : typeof data?.JsonData === "string"
            ? data.JsonData
            : null;

      if (!jsonString) {
        console.warn("Invalid round results format:", data);
        return;
      }

      // Parse the backend payload
      const parsed = JSON.parse(jsonString);

      // ✅ Normalize casing and structure to match RoundResultsPayload
      const payload: RoundResultsPayload = {
        letter: parsed.Letter ?? "",
        categories: parsed.Categories ?? [],
        players: Array.isArray(parsed.Players)
          ? parsed.Players.map((p: any) => ({
              name: p.Name ?? "",
              answers: p.Answers ?? {},
              scores: Object.fromEntries(
                Object.entries(p.Scores ?? {}).map(([category, score]: any) => [
                  category,
                  {
                    points: score.Points ?? 0,
                    reason: score.Reason ?? "",
                  },
                ]),
              ),
              total: p.Total ?? 0,
            }))
          : [],
      };

      console.log("✅ Normalized round results:", payload);

      // Update UI state
      setRoundResults(payload);
      setSessionState(SessionState.IN_ROUND_RESULTS);
    } catch (err) {
      console.warn("Failed to parse ROUND_RESULTS payload", err);
    }
  };

  const onGameFinished = (data: any): void => {
    try {
      const jsonString =
        typeof data === "string"
          ? data
          : typeof data?.JsonData === "string"
            ? data.JsonData
            : null;

      if (!jsonString) {
        console.warn("Invalid GAME_FINISHED payload:", data);
        return;
      }

      const parsed = JSON.parse(jsonString);

      if (parsed.Players && Array.isArray(parsed.Players)) {
        const players = parsed.Players.map((p: any) => ({
          name: p.Name ?? p.Nickname ?? "",
          total: p.Total ?? p.TotalScore ?? 0,
          answers: {},
          scores: {},
        }));

        setRoundResults({
          letter: "—",
          categories: [],
          players,
        });

        console.log("✅ Final game results parsed:", players);
      } else {
        console.warn("GAME_FINISHED payload missing Players:", parsed);
      }

      setSessionState(SessionState.IN_GAME_RESULTS);
    } catch (err) {
      console.warn("Failed to parse GAME_FINISHED payload", err);
    }
  };

  const onStop = (): void => {
    const jsonData = {
      Answers: [...answers],
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

  /**
   * Sends a hint request to the backend for the provided category.  Hints can
   * only be requested when the game is currently in a round and the player
   * still has tokens remaining. The active round letter is included in
   * the payload.  If no tokens remain, a snackbar notification is shown.
   */
  const onHintPress = (category: string) => {
    if (sessionState !== SessionState.IN_ROUND) return;

    if (hintTokensLeft <= 0) {
      setSnackbar({
        visible: true,
        message: "No hints left for this game",
        color: ERROR_SNACKBAR_COLOR,
      });
      return;
    }

    try {
      const payload = {
        Type: "GAME_SESSION|REQUEST_HINT",
        JsonData: JSON.stringify({
          category: category,
          letter: roundLetter,
        }),
      };

      webSocketService.sendMessage(payload); // ✅ single-argument version
    } catch (err) {
      console.warn("Failed to send hint request", err);
    }
  };

  /**
   * Closes the hint modal and clears the current hint text.  This does not
   * restore any tokens, it simply hides the hint popup.
   */
  const closeHintModal = () => {
    setHintModalVisible(false);
    setCurrentHint("");
  };

  const isStopAvailable = (): boolean => {
    return answers.every(
      (a) => a.trim().length > 1 && a.toUpperCase().startsWith(roundLetter),
    );
  };

  const handleRoundResultContinue = (): void => {
    setNotifiedIsReady(true);
    webSocketService.sendMessage({
      Type: "GAME_SESSION|READY_FOR_NEXT_ROUND",
      JsonData: "{}",
    });
  };

  const handleGameResultContinue = (): void => {
    handleGoBack();
  };

  useEffect(() => {
    const setup = async () => {
      const gm = new GameManager();
      const gameData: GameRoomData | null = await gm.getGameRoomData();

      setCategories(gameData?.Settings.CategoriesArray ?? []);
      setAnswers(Array(gameData?.Settings.CategoriesArray?.length).fill(""));

      // Initialise hint tokens based on the current room settings (default to 3)
      const initialTokens = (gameData?.Settings as any)?.HintTokens;
      setHintTokensLeft(
        typeof initialTokens === "number" && initialTokens >= 0
          ? initialTokens
          : 3,
      );

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
    webSocketService.addCallbacks(
      "GAME_SESSION|ROUND_RESULTS_SENT",
      onRoundResultReceived,
    );
    webSocketService.addCallbacks("GAME_SESSION|GAME_FINISHED", onGameFinished);

    // Listen for hint responses from the backend to update the UI
    webSocketService.addCallbacks("GAME_SESSION|HINT_RESPONSE", onHintResponse);

    if (sessionState === SessionState.JOINING) {
      setSessionState(SessionState.WAITING_ROUND_START);
      setup();
    }
  }, [answers, categories, roundLetter]);

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
              {/* Hint overlay button for mobile */}
              <TouchableOpacity
                onPress={() => onHintPress(category)}
                disabled={
                  hintTokensLeft <= 0 || sessionState !== SessionState.IN_ROUND
                }
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 5,
                  padding: 4,
                }}
              >
                <Icon
                  name="help-circle"
                  size={24}
                  color={
                    hintTokensLeft > 0 && sessionState === SessionState.IN_ROUND
                      ? Colors.primary
                      : "#ccc"
                  }
                />
              </TouchableOpacity>

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

    // 💻 Web version
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
            {/* Hint overlay button for web */}
            <TouchableOpacity
              onPress={() => onHintPress(category)}
              disabled={
                hintTokensLeft <= 0 || sessionState !== SessionState.IN_ROUND
              }
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 5,
                padding: 4,
              }}
            >
              <Icon
                name="help-circle"
                size={26}
                color={
                  hintTokensLeft > 0 && sessionState === SessionState.IN_ROUND
                    ? Colors.primary
                    : "#ccc"
                }
              />
            </TouchableOpacity>

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

  const renderRoundResults = () => {
    if (!roundResults) return <Text>No results yet.</Text>;

    const normalizeName = (n: string | undefined | null) =>
      (n ?? "").replace(/\s+/g, "").trim().toLowerCase();

    const myResult = roundResults.players.find(
      (p) => normalizeName(p.name) === normalizeName(pdata?.nickname),
    );

    const otherPlayers = roundResults.players.filter(
      (p) => normalizeName(p.name) !== normalizeName(pdata?.nickname),
    );

    // 🖼 static mapping (same as renderCards)
    const categoryIcons: Record<string, any> = {
      Name: personIcon,
      "Country or City": globeIcon,
      "Fruit or Food": foodIcon,
      Animal: animalIcon,
      Color: colorIcon,
    };

    // 🏆 determine unique winner (no ties, non-zero only)
    const topScore = Math.max(...roundResults.players.map((p) => p.total));
    const tiedPlayers = roundResults.players.filter(
      (p) => p.total === topScore,
    );
    const hasUniqueWinner = tiedPlayers.length === 1 && topScore > 0;

    // Only mark winner if there's exactly one with >0
    const winnerName = hasUniqueWinner
      ? normalizeName(tiedPlayers[0].name)
      : null;

    const isWinner = (name: string) =>
      winnerName !== null && normalizeName(name) === winnerName;

    return (
      <View
        style={{
          marginTop: 0, // reduced gap above card
          width: "100%",
          paddingHorizontal: isWeb ? 10 : 8, // slightly tighter padding
        }}
      >
        {/* Round Letter title */}
        <Text
          style={{
            fontWeight: "700",
            fontSize: 20,
            color: Colors.secondary,
            textAlign: "center",
            marginBottom: 4, // was ~14–10 → reduced to close gap
          }}
        >
          Round Letter: {roundResults.letter?.toUpperCase() ?? "?"}
        </Text>

        {/* 🧍 My detailed results */}
        {myResult && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: isWeb ? 18 : 14,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: Colors.primary,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Your score this round — {myResult.total} pts{" "}
              {isWinner(myResult.name) && (
                <Text style={{ fontSize: isWeb ? 28 : 24, color: "#f4c542" }}>
                  {" "}
                  🏆
                </Text>
              )}
            </Text>
            {Object.entries(myResult.scores).map(
              ([category, score], i, arr) => {
                const icon = categoryIcons[category] ?? null;
                const answer = myResult.answers?.[category] ?? "";
                const isLast = i === arr.length - 1;

                return (
                  <View
                    key={`${category}-${i}`}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 8,
                      borderBottomWidth: isLast ? 0 : 0.5,
                      borderColor: "#e6e0ff",
                    }}
                  >
                    {icon && (
                      <Image
                        source={icon}
                        style={{
                          width: 45,
                          height: 45,
                          marginRight: 10,
                        }}
                        resizeMode="contain"
                      />
                    )}
                    <Text
                      style={{ fontSize: 15, color: "#333", flexShrink: 1 }}
                    >
                      <Text style={{ fontWeight: "600" }}>{category}:</Text>{" "}
                      <Text
                        style={{ color: Colors.primary, fontWeight: "600" }}
                      >
                        {answer || "—"}
                      </Text>{" "}
                      ({score.points} pts)
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        )}

        {/* 🏆 Other players summary */}
        {otherPlayers.length > 0 && (
          <View
            style={{
              backgroundColor: "#f9f7ff",
              borderRadius: 16,
              paddingVertical: 10,
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 16,
                textAlign: "center",
                marginBottom: 6,
                color: Colors.primary,
              }}
            >
              Other Players
            </Text>

            {otherPlayers.map((p, i) => (
              <View
                key={`${p.name || "player"}-${i}`}
                style={{
                  borderTopWidth: i === 0 ? 0 : 0.5,
                  borderColor: "#e0dfff",
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: "#000",
                  }}
                >
                  {p.name} —{" "}
                  <Text style={{ fontWeight: "bold", color: "#000" }}>
                    {p.total} pts
                  </Text>{" "}
                  {isWinner(p.name) && (
                    <Text style={{ color: "#f4c542" }}>🏆</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (sessionState) {
      case SessionState.JOINING:
        return (
          <ContentCard
            title="Joining Game Session..."
            content={
              <WordRushSpinner
                text="Please Wait..."
                textColor="#000"
                size={100}
              />
            }
          />
        );
      case SessionState.WAITING_ROUND_START:
        return (
          <ContentCard
            title="Get ready! The round will start soon..."
            content={
              <WordRushSpinner
                text="Please Wait..."
                textColor="#000"
                size={100}
              />
            }
          />
        );
      case SessionState.IN_ROUND_EVALUATION: {
        return (
          <ContentCard
            title=""
            content={
              <WordRushSpinner
                text="STOP!! WordRush is evaluating all answers..."
                textColor="#000"
                size={100}
              />
            }
          />
        );
      }
      case SessionState.IN_ROUND:
        return (
          <ContentCard
            title=""
            content={
              <View>
                {/* Display remaining hint tokens */}
                <View style={{ alignItems: "center", marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: Colors.primary,
                    }}
                  >
                    Hints left: {hintTokensLeft}
                  </Text>
                </View>
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
      case SessionState.IN_ROUND_RESULTS:
        return (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <ContentCard
              title="Round Results"
              content={
                <View>
                  {renderRoundResults()}
                  <PrimaryButton
                    title="Ready for next round"
                    onPress={handleRoundResultContinue}
                    disabled={false}
                    loading={notifiedIsReady}
                  />
                </View>
              }
            />
          </Animated.View>
        );
      case SessionState.IN_GAME_RESULTS: {
        // sort players by total descending
        const allPlayers = [...(roundResults?.players ?? [])].sort(
          (a, b) => b.total - a.total,
        );

        const topScore = allPlayers.length > 0 ? allPlayers[0].total : 0;
        const winners =
          topScore > 0 ? allPlayers.filter((p) => p.total === topScore) : []; // 🧩 only count winners if topScore > 0

        return (
          <ContentCard
            title="Game Results"
            content={
              <View style={{ alignItems: "center" }}>
                {allPlayers.length === 0 ? (
                  <Text style={{ textAlign: "center", color: "#555" }}>
                    No results available.
                  </Text>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      marginBottom: 16,
                      backgroundColor: "#fff",
                      borderRadius: 16,
                      paddingVertical: 10,
                      shadowColor: "#000",
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    {allPlayers.map((p, i) => (
                      <View
                        key={`${p.name || "player"}-${i}`}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottomWidth:
                            i === allPlayers.length - 1 ? 0 : 0.5,
                          borderColor: "#eee",
                          paddingVertical: 10,
                          paddingHorizontal: 18,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: i === 0 ? "700" : "500",
                            color: i === 0 ? Colors.primary : "#000",
                          }}
                        >
                          {i + 1}. {p.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: i === 0 ? Colors.primary : "#333",
                          }}
                        >
                          {p.total} pts{" "}
                          {p.total === topScore && topScore > 0 && (
                            <Text
                              style={{
                                fontSize: 22,
                                lineHeight: 24,
                                color: "#f4c542",
                              }}
                            >
                              🏆
                            </Text>
                          )}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {winners.length > 0 && (
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "700",
                        color: Colors.primary,
                        marginBottom: 8,
                      }}
                    >
                      Winner{winners.length > 1 ? "s" : ""}!
                    </Text>

                    {winners.map((w) => (
                      <Text
                        key={w.name}
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          color: "#000",
                          textAlign: "center",
                        }}
                      >
                        {w.name}
                      </Text>
                    ))}
                  </View>
                )}

                <PrimaryButton
                  title="   Return to main menu   "
                  onPress={handleGameResultContinue}
                  disabled={false}
                  loading={false}
                />
              </View>
            }
          />
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />

      {/* ✅ NEW: GameRoomTitleBar */}
      <View style={{ marginTop: 20 }}>
        <GameRoomTitleBar username={pdata?.nickname} avatar={avatarSource} />
      </View>

      {sessionState !== SessionState.IN_GAME_RESULTS && (
        <ScreenTitleBar
          screenName={"Round Letter: " + roundLetter.toUpperCase()}
          onGoBackPress={handleGoBack}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>{renderContent()}</View>
      </ScrollView>

      {/* Hint modal: shown when a hint is received */}
      <Modal
        transparent
        visible={hintModalVisible}
        animationType="fade"
        onRequestClose={closeHintModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
              width: "85%",
              maxWidth: 400,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: Colors.primary,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Hint
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {currentHint || "No hint available."}
            </Text>
            <PrimaryButton
              title="Close"
              onPress={closeHintModal}
              disabled={false}
              loading={false}
            />
          </View>
        </View>
      </Modal>

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
