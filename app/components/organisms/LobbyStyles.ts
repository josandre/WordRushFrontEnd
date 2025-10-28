import { StyleSheet } from 'react-native'
import { Colors } from '../../theme/color'
import style from '../../theme/style'

export default StyleSheet.create({
  // Main container for the organism
  container: {
    flex: 1,
  },
  
  // Content wrapper inside ContentCard
  content: {
    padding: 16,
  },
  
  // Room ID text styling
  roomIdText: {
    ...style.subtitle,
    color: Colors.txt,
    textAlign: 'center',
  },
  
  // Players container
  playersContainer: {
    marginTop: 15,
  },
  
  // Waiting text styling
  waitingText: {
    color: Colors.txt,
    textAlign: 'center',
  },
  
  // Status container
  statusContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  
  // Status text styling
  statusText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  
  // Buttons container
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    gap: 12,
  },
  
  // Individual button wrapper
  buttonWrapper: {
    flex: 1,
  },
  
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  loadingText: {
    ...style.r16,
    color: Colors.txt,
    marginTop: 12,
  },
  
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  errorText: {
    ...style.r16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 12,
  },
})

export const LOBBY_COLORS = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  text: Colors.txt,
  background: Colors.bg,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
}
