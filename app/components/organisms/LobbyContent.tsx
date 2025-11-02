import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import ContentCard from '../atoms/ContentCard'
import PrimaryButton from '../atoms/PrimaryButton'
import PlayerCard from '../molecules/PlayerCard'
import { Colors } from '../../theme/color'
import styles from './LobbyStyles'

type LobbyContentProps = {
  roomId: string | null
  isOwner: boolean
  players: any[]
  storedProfile: any
  isStarting: boolean
  allReady: boolean
  onCopyRoomCode: () => void
  onToggleReady: () => void
  onStartGame: () => void
  onOpenConfigure: () => void
}

export default function LobbyContent({
  roomId,
  isOwner,
  players,
  storedProfile,
  isStarting,
  allReady,
  onCopyRoomCode,
  onToggleReady,
  onStartGame,
  onOpenConfigure
}: LobbyContentProps) {
  return (
    <View style={styles.container}>
      <ContentCard
        title="Lobby"
        content={
          <View style={styles.content}>
            {roomId ? (
              <View>
                <Text style={styles.roomIdText}>
                  Room ID: {roomId}
                </Text>
                <PrimaryButton
                  title="Copy Room Code"
                  onPress={onCopyRoomCode}
                />

                {isOwner ? (
                  <View>
                    <PrimaryButton
                      title="Configure Game Rules"
                      onPress={onOpenConfigure}
                      disabled={false}
                    />
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            ) : (
              <ActivityIndicator size="large" color={Colors.secondary} />
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
            
            {players.length > 1 ? (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  {allReady
                    ? "✅ All players are ready!"
                    : "Waiting for all players to be ready..."}
                </Text>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  There are not enough players in the GameRoom to start
                </Text>
              </View>
            )}

            {isOwner ? (
              <View>
                <PrimaryButton
                  title="Start Game"
                  onPress={onStartGame}
                  disabled={isStarting || !allReady}
                  loading={isStarting}
                />
              </View>
            ) : (
              <View></View>
            )}
          </View>
        }
      />
    </View>
  )
}
