import React from 'react'
import { View } from 'react-native'
import ContentCard from '../atoms/ContentCard'
import RoomInfo from '../atoms/RoomInfo'
import CurrentPlayerCard from '../molecules/CurrentPlayerCard'
import PlayerList from '../molecules/PlayerList'
import GameActions from '../molecules/GameActions'
import styles from './GameRoomStyles'

type Player = {
  UserId: string
  Nickname: string
  Avatar: string
  IsReady: boolean
  IsOwner: boolean
  Email?: string
}

type UserProfile = {
  nickname?: string
  avatar?: string
  email?: string
}

type GameRoomProps = {
  roomId: string
  isOwner: boolean
  players: Player[]
  myPlayer?: Player
  userProfile?: UserProfile
  onEndGame: () => void
  onStartGame?: () => void
  onConfigure?: () => void
  canStartGame?: boolean
}

export default function GameRoomContent({
  roomId,
  isOwner,
  players,
  myPlayer,
  userProfile,
  onEndGame,
  onStartGame,
  onConfigure,
  canStartGame = false
}: GameRoomProps) {

  const otherPlayers = players.filter(
    (p) =>
      !userProfile?.email ||
      p.Email?.toLowerCase() !== userProfile.email.toLowerCase()
  )

  return (
    <View style={styles.gameRoomContainer}>
      <ContentCard
        title=""
        content={
          <View style={styles.content}>
            <View style={styles.section}>
              <RoomInfo roomId={roomId} isOwner={isOwner} />
            </View>
            
            <View style={styles.section}>
              <CurrentPlayerCard
                myPlayer={myPlayer}
                userProfile={userProfile}
                isOwner={isOwner}
              />
            </View>

            <View style={styles.section}>
              <PlayerList
                players={otherPlayers}
                currentUserEmail={userProfile?.email}
                showReadyButtons={false}
              />
            </View>

            <View style={styles.lastSection}>
              <GameActions
                isOwner={isOwner}
                onEndGame={onEndGame}
                onStartGame={onStartGame}
                onConfigure={onConfigure}
                canStartGame={canStartGame}
              />
            </View>
          </View>
        }
      />
    </View>
  )
}