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

type UserProfile = {
  nickname?: string
  avatar?: string
  email?: string
}

type CurrentPlayerCardProps = {
  myPlayer?: Player
  userProfile?: UserProfile
  isOwner: boolean
}

export default function CurrentPlayerCard({ 
  myPlayer, 
  userProfile, 
  isOwner 
}: CurrentPlayerCardProps) {
  if (myPlayer) {
    return (
      <View style={styles.currentPlayerContainer}>
        <PlayerCard
          nickname={myPlayer.Nickname}
          avatar={myPlayer.Avatar}
          isReady={myPlayer.IsReady}
          isOwner={myPlayer.IsOwner}
          readyLabel={myPlayer.IsReady ? "Ready" : "Not Ready"}
          showReadyButton={false}
        />
      </View>
    )
  }

  if (userProfile) {
    return (
      <View style={styles.currentPlayerContainer}>
        <PlayerCard
          nickname={userProfile.nickname ?? "You"}
          avatar={userProfile.avatar ?? "default"}
          isReady={false}
          isOwner={isOwner}
          readyLabel="You"
          showReadyButton={false}
        />
      </View>
    )
  }

  return null
}
