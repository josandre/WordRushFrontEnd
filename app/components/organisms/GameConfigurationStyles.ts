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
  
  // Section spacing
  section: {
    marginBottom: 20,
  },
  
  // Configuration summary styles
  summaryContainer: {
    backgroundColor: Colors.bord,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  
  summaryTitle: {
    ...style.subtitle,
    color: Colors.txt,
    marginBottom: 12,
  },
  
  summaryText: {
    ...style.r14,
    color: Colors.active,
    marginBottom: 4,
  },
  
  // Buttons container
  buttonsContainer: {
    gap: 12,
  },
  
  // Individual button wrapper
  buttonWrapper: {
    width: '100%',
  },
  
  // Discard button specific styling
  discardButton: {
    backgroundColor: Colors.btn,
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

export const GAME_CONFIGURATION_COLORS = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  text: Colors.txt,
  background: Colors.bg,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
  active: Colors.active,
  border: Colors.bord,
  button: Colors.btn,
}
