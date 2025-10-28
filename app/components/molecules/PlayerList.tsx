import React from 'react'
import { View } from 'react-native'
import PlayerCard from './PlayerCard'
import styles from '../organisms/GameRoomStyles'

type Player = {
  UserId: string
  Nickname: string
  Avatar: string
  IsReady: boolean
  IsOwner: boolean
  Email?: string
}

type PlayerListProps = {
  players: Player[]
  currentUserEmail?: string
  showReadyButtons?: boolean
}

export default function PlayerList({ 
  players, 
  currentUserEmail, 
  showReadyButtons = false 
}: PlayerListProps) {
  return (
    <View style={styles.playerListContainer}>
      {players.map((player) => (
        <View key={player.UserId} style={styles.playerItem}>
          <PlayerCard
            nickname={player.Nickname}
            avatar={player.Avatar}
            isReady={player.IsReady}
            isOwner={player.IsOwner}
            readyLabel={player.IsReady ? "Ready" : "Not Ready"}
            showReadyButton={showReadyButtons}
          />
        </View>
      ))}
    </View>
  )
}
