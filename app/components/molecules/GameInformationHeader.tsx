import React from "react";
import { View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../theme/color";
import styles from "./GameInformationHeaderStyles";

export default function GameInformationHeader() {
  return (
    <View style={styles.headerSection}>
      <View style={styles.headerIconContainer}>
        <Icon name="trophy" size={40} color={Colors.primary} />
      </View>
      <Text style={styles.headerTitle}>Your Game Statistics</Text>
      <Text style={styles.headerSubtitle}>
        Track your progress and achievements
      </Text>
    </View>
  );
}

