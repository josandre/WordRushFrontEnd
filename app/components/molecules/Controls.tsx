import React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "../atoms/PrimaryButton";
import { InputAtom } from "../atoms/InputAtom";

type Props = {
  onCreate: () => void;
  onJoin: (roomId: string) => void;
  onClose: () => void;
  isOwner: boolean;
};

export const Controls: React.FC<Props> = ({
  onCreate,
  onJoin,
  onClose,
  isOwner,
}) => {
  const [roomId, setRoomId] = React.useState("");

  return (
    <View style={styles.row}>
      <PrimaryButton title="Create Game Room" onPress={onCreate} />
      <InputAtom
        placeholder="Room ID"
        value={roomId}
        onChangeText={setRoomId}
      />
      <PrimaryButton title="Join Game Room" onPress={() => onJoin(roomId)} />
      {isOwner && <PrimaryButton title="Close Game Room" onPress={onClose} />}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { gap: 8, marginBottom: 8 },
});
