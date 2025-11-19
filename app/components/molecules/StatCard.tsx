import React from "react";
import { View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../theme/color";
import styles from "./StatCardStyles";

interface StatCardProps {
  icon: string;
  iconColor: string;
  title: string;
  value: string | number;
  subtitle?: string;
  gradientColor: string;
}

export default function StatCard({
  icon,
  iconColor,
  title,
  value,
  subtitle,
  gradientColor,
}: StatCardProps) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: Colors.bg,
          borderLeftWidth: 4,
          borderLeftColor: gradientColor,
        },
      ]}
    >
      <View style={styles.statCardHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${gradientColor}15` },
          ]}
        >
          <Icon name={icon} size={28} color={iconColor} />
        </View>
        <View style={styles.statCardContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

