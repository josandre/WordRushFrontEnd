import React from "react";
import { View } from "react-native";
import { Colors } from "../../theme/color";
import mstyles from "./styles";

type PaginationDotsProps = {
  total: number;
  activeIndex: number;
};

export default function PaginationDots({
  total,
  activeIndex,
}: PaginationDotsProps) {
  return (
    <View style={mstyles.dotsContainer}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        if (isActive) {
          return (
            <View key={index} style={mstyles.dotActiveWrapper}>
              <View style={mstyles.dot}></View>
            </View>
          );
        }
        return <View key={index} style={mstyles.dot}></View>;
      })}
    </View>
  );
}
