import React from "react";
import { View, Text } from "react-native";
import ContentCard from "../atoms/ContentCard";
import PrimaryButton from "../atoms/PrimaryButton";
import { Colors } from "../../theme/color";
import style from "../../theme/style";
import styles from "./ConfigureLobbyStyles";

type ConfigureLobbyContentProps = {
  onAccept: () => void;
  onDiscard: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function ConfigureLobbyContent({
  onAccept,
  onDiscard,
  loading = false,
  disabled = false,
}: ConfigureLobbyContentProps) {
  return (
    <View style={styles.container}>
      <ContentCard
        title=""
        content={
          <View style={styles.content}>
            <Text style={styles.descriptionText}>
              Here you will see the lobby settings
            </Text>

            <View style={styles.buttonsContainer}>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Save Changes"
                  onPress={onAccept}
                  disabled={disabled || loading}
                  loading={loading}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Discard Changes"
                  onPress={onDiscard}
                  disabled={disabled || loading}
                  loading={false}
                />
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
}
