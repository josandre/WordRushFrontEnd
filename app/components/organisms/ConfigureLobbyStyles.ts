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
  
  // Description text styling
  descriptionText: {
    ...style.r16,
    color: Colors.txt,
    flex: 1,
    marginBottom: 24,
    textAlign: 'center',
  },
  
  // Buttons container
  buttonsContainer: {
    gap: 16,
  },
  
  // Individual button wrapper
  buttonWrapper: {
    width: '100%',
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

export const CONFIGURE_LOBBY_COLORS = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  text: Colors.txt,
  background: Colors.bg,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
}
