import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { MessageAtom } from "../atoms/MessageAtom";

type Props = {
  messages: { text: string; type: "server" | "you" | "error" }[];
};

export const ChatBox: React.FC<Props> = ({ messages }) => (
  <ScrollView style={styles.box}>
    {messages.map((m, i) => (
      <MessageAtom key={i} text={m.text} type={m.type} />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    height: 250,
    borderRadius: 5,
  },
});
