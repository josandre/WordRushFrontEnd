import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { InputAtom } from "../atoms/InputAtom";
import PrimaryButton from "@/app/components/atoms/PrimaryButton";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";
import { getStoredProfile } from "@/app/screens/UserProfile/services/usetStoredProfile";

type RouteParams = {
  roomId: string;
  isOwner: boolean;
};

type RoomUser = {
  name: string;
  avatar?: string;
};

export default function GameRoom() {
  const route = useRoute();
  const { roomId, isOwner } = route.params as RouteParams;
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; type: "server" | "you" | "error" }[]
  >([]);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5178/ws");
    socketRef.current = ws;

    ws.onopen = async () => {
      setConnected(true);
      addMessage("Connected to Game Room", "server");

      const profile = await getStoredProfile();
      if (profile) {
        ws.send(
          `UPDATE_PROFILE:${JSON.stringify({ Name: profile.nickname, Avatar: profile.avatar })}`
        );
      }

      if (isOwner) addMessage(`You are the host of room ${roomId}`, "server");
      else ws.send(`JOIN_GAMEROOM:${roomId}`);
    };

    ws.onmessage = (e) => handleMessage(e.data);
    ws.onclose = () => {
      setConnected(false);
      addMessage("Disconnected from server", "error");
    };

    return () => ws.close();
  }, [roomId, isOwner]);

  const addMessage = (
    text: string,
    type: "server" | "you" | "error" = "server"
  ) => setMessages((prev) => [...prev, { text, type }]);

  const handleMessage = (msg: string) => {
    if (msg.startsWith("USER_LIST_JSON:")) {
      try {
        const json = msg.replace("USER_LIST_JSON:", "");
        const parsed: RoomUser[] = JSON.parse(json);
        setUsers(parsed);
      } catch {
        console.error("Failed to parse user list");
      }
      return;
    }
    addMessage(msg, "server");
  };

  const send = (text: string) => {
    if (!socketRef.current || !connected) return;
    socketRef.current.send(text);
  };

  const closeRoom = () => {
    if (!socketRef.current || !connected) return;
    socketRef.current.send("CLOSE_GAMEROOM");
  };

  return (
    <View
      style={[
        style.container,
        { backgroundColor: Colors.background, padding: 16 },
      ]}
    >
      <Text style={[style.text, { fontWeight: "600", marginBottom: 8 }]}>
        Status:{" "}
        <Text style={{ color: connected ? Colors.success : Colors.error }}>
          {connected ? "Connected" : "Disconnected"}
        </Text>
      </Text>

      <Text style={style.text}>Room: {roomId}</Text>

      {isOwner && (
        <PrimaryButton
          title="Close Game Room"
          onPress={closeRoom}
          disabled={!connected}
        />
      )}

      <ScrollView style={{ marginVertical: 10, flex: 1 }}>
        <Text style={[style.text, { fontWeight: "600", marginBottom: 4 }]}>
          Users in Room:
        </Text>

        {users.map((user, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 4,
              backgroundColor: "#fff",
              padding: 8,
              borderRadius: 8,
            }}
          >
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors.btn,
                  marginRight: 10,
                }}
              />
            )}
            <Text style={[style.text, { fontWeight: "500" }]}>{user.name}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: 10 }}>
        <InputAtom
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <PrimaryButton
          title="Send"
          onPress={() => {
            send(input);
            addMessage("You: " + input, "you");
            setInput("");
          }}
          disabled={!connected || !input.trim()}
        />
      </View>
    </View>
  );
}
