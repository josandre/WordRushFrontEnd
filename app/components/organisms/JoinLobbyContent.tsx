import React from 'react'
import { View, Text, TextInput } from 'react-native'

import style from "@/app/theme/style";
import styles from './JoinLobbyStyles'
import { Colors } from "@/app/theme/color";

import ContentCard from '../atoms/ContentCard'
import PrimaryButton from '../atoms/PrimaryButton'

type JoinLobbyContentProps = {
  roomCode: string
  isJoining: boolean
  onRoomCodeChange: (code: string) => void
  onJoinRoom: () => void
  onRoomCodeValid: () => boolean
}

export default function JoinLobbyContent({
  roomCode,
  isJoining,
  onRoomCodeChange,
  onJoinRoom,
  onRoomCodeValid
}: JoinLobbyContentProps) {
  return (
    <View style={styles.container}>
      <ContentCard
        title="Lobby"
        content={
          <View style={styles.content}>
            <Text style={styles.instructionText}>
              Enter a Room Code
            </Text>
            <TextInput
              value={roomCode}
              onChangeText={onRoomCodeChange}
              placeholder="e.g. abcd1234"
              placeholderTextColor={Colors.disable}
              style={style.txtinput}
            />
            <PrimaryButton
              title="Join Game Room"
              onPress={onJoinRoom}
              disabled={!onRoomCodeValid() || isJoining}
              loading={isJoining}
            />
          </View>
        }
      />
    </View>
  )
}
