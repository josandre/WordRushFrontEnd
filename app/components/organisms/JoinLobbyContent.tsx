import React from 'react'
import { View, Text, TextInput } from 'react-native'
import ContentCard from '../atoms/ContentCard'
import PrimaryButton from '../atoms/PrimaryButton'
import PlayerCard from '../molecules/PlayerCard'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import styles from './JoinLobbyStyles'

type JoinLobbyContentProps = {
  roomId: string | null
  roomCode: string
  players: any[]
  storedProfile: any
  isJoining: boolean
  onRoomCodeChange: (code: string) => void
  onJoinRoom: () => void
  onCopyRoomCode: () => void
  onToggleReady: () => void
  onRoomCodeValid: () => boolean
}

export default function JoinLobbyContent({
  roomId,
  roomCode,
  players,
  storedProfile,
  isJoining,
  onRoomCodeChange,
  onJoinRoom,
  onCopyRoomCode,
  onToggleReady,
  onRoomCodeValid
}: JoinLobbyContentProps) {
  const allReady = players.length > 0 && players.every((p) => p.IsReady)

  return (
    <View style={styles.container}>
      <ContentCard
        title="Lobby"
        content={
          <View style={styles.content}>
            {!roomId ? (
              <>
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
              </>
            ) : (
              <>
                <Text style={styles.roomIdText}>
                  Room ID: {roomId}
                </Text>
                <PrimaryButton
                  title="Copy Room Code"
                  onPress={onCopyRoomCode}
                />
              </>
            )}

            <View style={styles.playersContainer}>
              {players.length > 0 ? (
                players.map((p) => {
                  const myEmail = storedProfile?.email?.toLowerCase()
                  const myNickname = storedProfile?.nickname
                    ?.trim()
                    ?.toLowerCase()
                  const isMe =
                    p.Email?.toLowerCase() === myEmail ||
                    p.Nickname?.trim()?.toLowerCase() === myNickname

                  return (
                    <PlayerCard
                      key={p.UserId}
                      nickname={p.Nickname}
                      avatar={p.Avatar}
                      isReady={p.IsReady}
                      isOwner={p.IsOwner}
                      readyLabel={p.IsReady ? "Ready" : "Not Ready"}
                      showReadyButton={isMe}
                      onToggleReady={onToggleReady}
                    />
                  )
                })
              ) : (
                <Text style={styles.waitingText}>
                  Waiting for players...
                </Text>
              )}
            </View>

            {players.length > 0 && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  {allReady
                    ? "✅ Everyone is ready! Waiting for host to start..."
                    : "Waiting for all players to be ready..."}
                </Text>
              </View>
            )}
          </View>
        }
      />
    </View>
  )
}
