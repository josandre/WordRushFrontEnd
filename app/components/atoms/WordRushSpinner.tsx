import React, { useEffect, useRef } from "react";
import { Animated, Image, View, Text, StyleSheet, Easing } from "react-native";
import { Colors } from "@/app/theme/color";

import rushlogo from "@/assets/image/logo2.png";

interface WordRushSpinnerProps {
  text?: string;
  showText?: boolean;
  textColor?: string;
  textSize?: number;
  size?: number;
  pulse?: boolean;
}

export default function WordRushSpinner({
  text = "Loading...",
  showText = true,
  textColor = "#000",
  textSize = 16,
  size = 96,
  pulse = true,
}: WordRushSpinnerProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinLoop = () => {
      spinAnim.setValue(0);
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spinLoop());
    };
    spinLoop();

    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [pulse]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={rushlogo}
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }, { scale: scaleAnim }],
        }}
        resizeMode="contain"
      />
      {showText && (
        <Text style={[styles.text, { color: textColor, fontSize: textSize }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
    color: Colors.primary,
    fontWeight: "600",
  },
});
