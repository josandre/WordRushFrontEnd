import React from "react";
import { View } from "react-native";
import PrimaryButton from "../atoms/PrimaryButton";
import styles from "../organisms/GameRoomStyles";

type GameActionsProps = {
  isOwner: boolean;
  onEndGame: () => void;
  onStartGame?: () => void;
  onConfigure?: () => void;
  canStartGame?: boolean;
};

export default function GameActions({
  isOwner,
  onEndGame,
  onStartGame,
  onConfigure,
  canStartGame = false,
}: GameActionsProps) {
  if (!isOwner) return null;

  return (
    <View style={styles.gameActionsContainer}>
      {onStartGame && canStartGame && (
        <View style={styles.actionButton}>
          <PrimaryButton title="Start Game" onPress={onStartGame} />
        </View>
      )}
      {onConfigure && (
        <View style={styles.actionButton}>
          <PrimaryButton title="Configure Game" onPress={onConfigure} />
        </View>
      )}
      <View style={styles.actionButton}>
        <PrimaryButton title="End Game" onPress={onEndGame} />
      </View>
    </View>
  );
}
