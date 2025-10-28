import React from 'react'
import { View, Text } from 'react-native'
import styles from '../organisms/GameRoomStyles'

type RoomInfoProps = {
  roomId: string
  isOwner: boolean
}

export default function RoomInfo({ roomId, isOwner }: RoomInfoProps) {
  return (
    <View style={styles.roomInfoContainer}>
      <Text style={styles.roomIdText}>
        Room ID: {roomId}
      </Text>
      <Text style={styles.statusText}>
        {isOwner ? "You are the host" : "Waiting for host to start..."}
      </Text>
    </View>
  )
}
