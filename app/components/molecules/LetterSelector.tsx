import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import moleculeStyles from "./styles";

type LetterSelectorProps = {
  selectedLetters: string[];
  onLetterToggle: (letter: string) => void;
  maxSelection?: number;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterSelector({
  selectedLetters,
  onLetterToggle,
  maxSelection = 5,
}: LetterSelectorProps) {
  const isLetterSelected = (letter: string) => selectedLetters.includes(letter);
  const canSelectMore = selectedLetters.length < maxSelection;

  const handleLetterPress = (letter: string) => {
    if (isLetterSelected(letter)) {
      onLetterToggle(letter);
    } else if (canSelectMore) {
      onLetterToggle(letter);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={[style.r16, { color: Colors.txt }]}>Select Letters</Text>
        <Text style={[style.r14, { color: Colors.disable }]}>
          {selectedLetters.length}/{maxSelection}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        <View style={moleculeStyles.letterGrid}>
          {ALPHABET.map((letter) => {
            const isSelected = isLetterSelected(letter);
            const isDisabled = !isSelected && !canSelectMore;

            return (
              <TouchableOpacity
                key={letter}
                onPress={() => handleLetterPress(letter)}
                disabled={isDisabled}
                style={[
                  moleculeStyles.letterButton,
                  {
                    backgroundColor: isSelected ? Colors.primary : Colors.bg,
                    borderColor: isSelected ? Colors.primary : "#E5E9EF",
                    opacity: isDisabled ? 0.3 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    style.r16,
                    {
                      color: isSelected ? Colors.secondary : Colors.active,
                      fontWeight: isSelected ? "bold" : "normal",
                    },
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedLetters.length > 0 && (
        <View style={moleculeStyles.selectedLettersContainer}>
          <Text style={[style.r14, { color: Colors.txt, marginBottom: 8 }]}>
            Selected Letters:
          </Text>
          <View style={moleculeStyles.selectedLettersList}>
            {selectedLetters.map((letter, index) => (
              <View key={letter} style={moleculeStyles.selectedLetterItem}>
                <Text style={[style.r14, { color: Colors.primary }]}>
                  {letter}
                </Text>
                <TouchableOpacity
                  onPress={() => onLetterToggle(letter)}
                  style={moleculeStyles.removeLetterButton}
                >
                  <Icon name="close" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
