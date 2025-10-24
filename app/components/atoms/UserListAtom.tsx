import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  users: string[];
};

export const UserListAtom: React.FC<Props> = ({ users }) => (
  <View style={styles.container}>
    {users.map((user, i) => (
      <Text key={i} style={styles.user}>
        {user}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
  user: { paddingVertical: 2 },
});
