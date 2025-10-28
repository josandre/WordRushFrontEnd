import { StyleSheet } from 'react-native'
import { Colors } from '../../theme/color'
import style from '../../theme/style'

export default StyleSheet.create({
  // GameRoomContent organism styles
  gameRoomContainer: {
    flex: 1,
  },
  
  // RoomInfo atom styles
  roomInfoContainer: {
    marginBottom: 15,
  },
  roomIdText: {
    ...style.subtitle,
    color: Colors.txt,
  },
  statusText: {
    ...style.m16,
    color: Colors.txt,
    marginBottom: 15,
  },
  
  // PlayerList molecule styles
  playerListContainer: {
    marginTop: 20,
  },
  playerItem: {
    marginBottom: 12,
  },
  
  // CurrentPlayerCard molecule styles
  currentPlayerContainer: {
    marginBottom: 20,
  },
  
  // GameActions molecule styles
  gameActionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  
  // Common styles
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  lastSection: {
    marginBottom: 0,
  },
})

export const GAME_ROOM_COLORS = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  text: Colors.txt,
  background: Colors.bg,
  border: Colors.border,
  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
}
