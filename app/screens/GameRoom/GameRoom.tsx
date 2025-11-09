import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Animated,
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

// 🖼️ Category icons
import personIcon from "@/assets/icons/person.png";
import globeIcon from "@/assets/icons/globe.png";
import foodIcon from "@/assets/icons/food.png";
import animalIcon from "@/assets/icons/animal.png";
import colorIcon from "@/assets/icons/color.png";
import rushlogo from "@/assets/image/logo2.png";
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
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sessionState === SessionState.IN_ROUND_EVALUATION) {
      // continuous spin (manual recursion for web reliability)
      const spinOnce = () => {
        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }).start(() => spinOnce());
      };
      spinOnce();

      // continuous gentle pulse (scale 0.9–1.1)
      const pulseAnim = new Animated.Value(1);
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.9,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // attach pulseAnim to global scope for render use
      (spinAnim as any).pulse = pulseAnim;
    }
  }, [sessionState]);

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
      case SessionState.IN_ROUND_EVALUATION: {
        const spin = spinAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <ContentCard
            title=""
            content={
              <Animated.View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 50,
                  opacity: fadeAnim,
                }}
              >
                {/* 🌀 Rotating WordRush logo */}
                <Animated.Image
                  source={rushlogo} // replace if your logo lives elsewhere
                  style={{
                    width: 96,
                    height: 96,
                    transform: [
                      { rotate: spin },
                      { scale: (spinAnim as any).pulse ?? 1 },
                    ],

                    marginBottom: 30,
                  }}
                  resizeMode="contain"
                />

                {/* 🗨️ Evaluation text */}
                <Text
                  style={{
                    fontSize: 26,
                    color: "#f50000ff",
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingHorizontal: 24,
                    lineHeight: 22,
                  }}
                >
                  STOP!!
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    textAlign: "center",
                    paddingHorizontal: 24,
                    lineHeight: 22,
                  }}
                >
                  The game engine is scoring every player’s responses for this
                  round. Please hold tight while WordRush’s AI checks all
                  categories.
                </Text>
              </Animated.View>
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
