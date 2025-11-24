import React, { useState, useEffect } from "react";
import { StatusBar, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Snackbar } from "@react-native-material/core";
import { AppNavigation } from "../../navigator/AppNavigationTypes";
import ScreenTitleBar from "../../components/molecules/ScreenTitleBar";
import GameConfigurationContent from "../../components/organisms/GameConfigurationContent";
import useUpdateGameSettings from "./services/useUpdateGameSettings";
import {
  LetterOrder,
  gameOrderToLetterOrder,
  letterOrderToGameOrder,
} from "./services/constants";
import styles, { ERROR_SNACKBAR_COLOR } from "./styles";
import GameManager from "../../StorageManager/GameManager/GameManager";
import { GameRoomData } from "../Home/constants";
import { GameSettings } from "./services/useUpdateGameSettings";
import webSocketService from "@/app/services/webSocketService";

type SnackBarProps = {
  visible: boolean;
  message?: string;
  color?: string;
};

const FALLBACK_ERROR_MESSAGE = "An error occurred updating game settings";

type RouteParams = {
  roomId: string;
};

export default function GameConfiguration() {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute();
  const { roomId } = (route.params as RouteParams) || { roomId: "" };
  const { updateGameSettings, loading } = useUpdateGameSettings();
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [gameRoomData, setGameRoomData] = useState<GameRoomData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [timeLimit, setTimeLimit] = useState<number>(45);
  const [selectedLetters, setSelectedLetters] = useState<string[]>(["A"]);
  const [letterOrder, setLetterOrder] = useState<LetterOrder>(
    LetterOrder.Ascending,
  );
  const [categories, setCategories] = useState<string[] | null>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [waitingForValidCategoryCheck, setWaitingForValidCategoryCheck] = useState<boolean>(false);

  // Number of hint tokens (default to 3)
  const [hintTokens, setHintTokens] = useState<number>(3);

  const sortLettersByOrder = (
    letters: string[],
    order: LetterOrder,
  ): string[] => {
    const sorted = [...letters].sort();
    return order === LetterOrder.Descending ? sorted.reverse() : sorted;
  };

  useEffect(() => {
    const loadGameRoomData = async () => {
      setLoadingData(true);
      const gameManager = new GameManager();
      const data = await gameManager.getGameRoomData();

      if (data) {
        setGameRoomData(data);
        if (data.Settings) {
          setTimeLimit(data.Settings.TimeLimit);
          const order = gameOrderToLetterOrder(data.Settings.Order);
          setLetterOrder(order);

          const lettersFromStorage = data.Settings.Letters
            ? [...data.Settings.Letters]
            : ["A"];
          const sortedLetters = sortLettersByOrder(lettersFromStorage, order);
          setSelectedLetters(sortedLetters);

          // Load hint tokens from settings, default to 3 if missing
          const tokens = (data.Settings as any).HintTokens;
          setHintTokens(tokens !== undefined && tokens !== null ? tokens : 3);
          
          setCategories(data.Settings.Categories);
        }
      }
      setLoadingData(false);
      setInitialDataLoaded(true);
    };

    webSocketService.connect();
    webSocketService.addCallbacks("GAME_ROOM|VALID_CATEGORY_CHECK_RESULT", onValidCategoryCheckResult);

    if (!initialDataLoaded) {
        loadGameRoomData();
    }
  }, [roomId, timeLimit, selectedLetters, letterOrder, categories, newCategory]);

  const handleLetterToggle = (letter: string) => {
    setSelectedLetters((prev) => {
      if (prev.includes(letter)) {
        const newLetters = prev.filter((l) => l !== letter);
        return sortLettersByOrder(newLetters, letterOrder);
      } else if (prev.length < 5) {
        const newLetters = [...prev, letter];
        return sortLettersByOrder(newLetters, letterOrder);
      }
      return prev;
    });
  };

  const handleOrderChange = (newOrder: LetterOrder) => {
    setLetterOrder(newOrder);
    setSelectedLetters((prev) => sortLettersByOrder(prev, newOrder));
  };

  const handleCategoryAdded = () => {
    const jsonData = {
      Category: newCategory,
    };
    
    webSocketService.sendMessage({
      Type: "GAME_ROOM|VALID_CATEGORY_CHECK",
      JsonData: JSON.stringify(jsonData)
    });
    
    setWaitingForValidCategoryCheck(true);
  }

  const onValidCategoryCheckResult = (data: any) => {
    const jsonData = JSON.parse(data.JsonData);
    
    console.log("Is valid category? ", newCategory, jsonData.IsValidCategory)
    console.log(data);
    // Add the category if valid
    if (jsonData.IsValidCategory) {
      setCategories((categories ? [...categories, jsonData.Category] : [jsonData.Category]));
    }

    setWaitingForValidCategoryCheck(false);
  }

  const handleCategoryRemoved = (categoryIndex: number) => {
    if (categories === null) {
      return; // Or handle this case as appropriate
    }
    const categoriesCopy = categories.filter((_, index) => index !== categoryIndex);
    setCategories(categoriesCopy);
  }

  const handleSaveConfiguration = async () => {
    const lettersToSave = sortLettersByOrder(selectedLetters, letterOrder);

    const payload: GameSettings = {
      RoomId: roomId,
      Settings: {
        Letters: lettersToSave,
        Categories: categories,
        TimeLimit: timeLimit,
        Order: letterOrderToGameOrder(letterOrder),
        HintTokens: hintTokens,
      },
    };

    updateGameSettings(payload)
      .then((result) => {
      })
      .then(() => {
        navigation.navigate("Lobby", {
          isOwner: true,
          roomId: roomId,
        });
      })
      .catch((error) => {
        const errorSnackBar: SnackBarProps = {
          visible: true,
          message: error.message || FALLBACK_ERROR_MESSAGE,
          color: ERROR_SNACKBAR_COLOR,
        };
        setSnackbar(errorSnackBar);
      });
  };

  const handleDiscardChanges = () => {
    if (gameRoomData?.Settings) {
      setTimeLimit(gameRoomData.Settings.TimeLimit);
      const order = gameOrderToLetterOrder(gameRoomData.Settings.Order);
      setLetterOrder(order);
      const letters = gameRoomData.Settings.Letters
        ? [...gameRoomData.Settings.Letters]
        : ["A"];
      setSelectedLetters(sortLettersByOrder(letters, order));
      // Reset tokens to stored value or default
      const tokens = (gameRoomData.Settings as any).HintTokens;
      setHintTokens(tokens !== undefined && tokens !== null ? tokens : 3);
    } else {
      setTimeLimit(45);
      setSelectedLetters(["A"]);
      setLetterOrder(LetterOrder.Ascending);
      setHintTokens(3);
    }
    navigation.navigate("Lobby", {
      isOwner: true,
      roomId: roomId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />

      <ScreenTitleBar
        screenName="Configure Game"
        onGoBackPress={() =>
          navigation.navigate("Lobby", {
            isOwner: true,
            roomId: roomId,
          })
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <GameConfigurationContent
          timeLimit={timeLimit}
          categories={categories}
          selectedLetters={selectedLetters}
          letterOrder={letterOrder}
          newCategory={newCategory}
          waitingForValidCategoryCheck={waitingForValidCategoryCheck}
          onTimeLimitChange={setTimeLimit}
          onLetterToggle={handleLetterToggle}
          onOrderChange={handleOrderChange}
          onCategoryAdded={handleCategoryAdded}
          onCategoryRemoved={handleCategoryRemoved}
          onNewCategoryChange={setNewCategory}
          onSaveConfiguration={handleSaveConfiguration}
          onDiscardChanges={handleDiscardChanges}
          loading={loading}
          disabled={loading || loadingData}
          gameRoomData={gameRoomData}
          hintTokens={hintTokens}
          onHintTokensChange={setHintTokens}
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
