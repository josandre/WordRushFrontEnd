import React from 'react'
import { View, Text, TextInput } from 'react-native'
import ContentCard from '../atoms/ContentCard'
import PrimaryButton from '../atoms/PrimaryButton'
import { Colors } from '../../theme/color'
import styles from './JoinLobbyStyles'

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
              style={styles.roomCodeInput}
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
