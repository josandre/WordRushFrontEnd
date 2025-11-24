import React, { useEffect } from "react";
import { View, Text } from "react-native";
import ContentCard from "../atoms/ContentCard";
import Select from "../atoms/Select";
import LetterSelector from "../molecules/LetterSelector";
import OrderSelector from "../molecules/OrderSelector";
import CategorySelector from "../molecules/CategorySelector";
import PrimaryButton from "../atoms/PrimaryButton";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import styles from "./GameConfigurationStyles";
import { GameRoomData, Category } from "../../screens/Home/constants";
import { LetterOrder } from "../../screens/Lobby/services/constants";

type GameConfigurationContentProps = {
  timeLimit: number;
  categories: string[] | null;
  selectedLetters: string[];
  letterOrder: LetterOrder;
  newCategory: string;
  waitingForValidCategoryCheck: boolean,
  onTimeLimitChange: (value: number) => void;
  onLetterToggle: (letter: string) => void;
  onOrderChange: (order: LetterOrder) => void;
  onNewCategoryChange: (newCategoryValue: string) => void;
  onCategoryAdded: () => void;
  onCategoryRemoved: (categoryIndex: number) => void;
  onSaveConfiguration: () => void;
  onDiscardChanges: () => void;
  loading?: boolean;
  disabled?: boolean;
  gameRoomData?: GameRoomData | null;

  /**
   * Number of hint tokens to start each game with.
   */
  hintTokens: number;
  /**
   * Callback invoked when the user selects a different number of hint tokens.
   */
  onHintTokensChange: (value: number) => void;
};

// Time options from 45 to 60 seconds in increments of 5
const TIME_OPTIONS = [
  { label: "45 seconds", value: 45 },
  { label: "50 seconds", value: 50 },
  { label: "55 seconds", value: 55 },
  { label: "60 seconds", value: 60 },
];

// Options for hint tokens (1–5).  Players consume one token per requested hint.
const TOKEN_OPTIONS = [
  { label: "1 token", value: 1 },
  { label: "2 tokens", value: 2 },
  { label: "3 tokens", value: 3 },
  { label: "4 tokens", value: 4 },
  { label: "5 tokens", value: 5 },
];

export default function GameConfigurationContent({
  timeLimit,
  categories,
  selectedLetters,
  letterOrder,
  newCategory,
  waitingForValidCategoryCheck,
  onTimeLimitChange,
  onLetterToggle,
  onOrderChange,
  onNewCategoryChange,
  onCategoryAdded,
  onCategoryRemoved,
  onSaveConfiguration,
  onDiscardChanges,
  loading = false,
  disabled = false,
  gameRoomData,
  hintTokens,
  onHintTokensChange,
}: GameConfigurationContentProps) {
  const isConfigurationValid = selectedLetters.length > 0;

  useEffect(() => {
  }, [categories]);

  return (
    <View style={styles.container}>
      <ContentCard
        title="Game Settings"
        content={
          <View style={styles.content}>
            {/* Hint Tokens Selector */}
            <View style={styles.section}>
              <Select
                label="Hint Tokens"
                value={hintTokens}
                options={TOKEN_OPTIONS}
                onValueChange={(value) => onHintTokensChange(value as number)}
                placeholder="Select number of hints"
                disabled={disabled}
              />
            </View>
            <View style={styles.section}>
              <LetterSelector
                selectedLetters={selectedLetters}
                onLetterToggle={onLetterToggle}
                maxSelection={5}
              />
            </View>
            <View style={styles.section}>
              <OrderSelector
                selectedOrder={letterOrder}
                onOrderChange={onOrderChange}
              />
            </View>

            <View style={styles.section}>
              <CategorySelector 
                categories={categories} 
                newCategory={newCategory}
                waitingForValidCategoryCheck={waitingForValidCategoryCheck}
                onCategoryAdded={onCategoryAdded}
                onCategoryRemoved={onCategoryRemoved}
                onNewCategoryChange={onNewCategoryChange}/>
            </View>

            {/* Configuration Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Configuration Summary</Text>
              <Text style={styles.summaryText}>
                Selected Letters: {selectedLetters.join(", ")}
              </Text>
              <Text style={styles.summaryText}>
                Order: {letterOrder === LetterOrder.Ascending ? "A-Z" : "Z-A"}
              </Text>
              <Text style={styles.summaryText}>Hint Tokens: {hintTokens}</Text>
              {categories && categories.length > 0 && (
                <Text style={styles.summaryText}>
                  Selected Categories:{" "}
                  {categories.map((c) => c).join(", ")}
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Save Configuration"
                  onPress={onSaveConfiguration}
                  disabled={!isConfigurationValid || disabled || loading}
                  loading={loading}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Discard Changes"
                  onPress={onDiscardChanges}
                  disabled={disabled || loading}
                  style={styles.discardButton}
                />
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
}
