import { StyleSheet } from 'react-native'
import { Colors } from '../../theme/color'
import style from '../../theme/style'

export default StyleSheet.create({
  // Main container styles
  container: {
    ...style.area,
    backgroundColor: Colors.primary,
  },
  
  // StatusBar styles
  statusBar: {
    translucent: true,
    backgroundColor: 'transparent',
  },
  
  // ScrollView styles
  scrollView: {
    marginTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  
  // Content wrapper styles
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Loading states
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
  
  // Error states
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
  
  // Snackbar styles
  snackbarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
})

export const CONFIGURE_LOBBY_SCREEN_COLORS = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  text: Colors.txt,
  background: Colors.bg,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
}

export const ERROR_SNACKBAR_COLOR = "#d32f2f";
