import { Snackbar } from '@react-native-material/core'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    backgroundImage: {
        flex: 1
    },
    keyboardAvoiding: {
        flex: 1
    },
    contentWrapper: {
        flex: 1,
        margin: 18,
        justifyContent: 'flex-end'
    },
    snackbarContainer: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 16,
    }

})

export const SUCCESS_SNACKBAR_COLOR  = '#2e7d32' 
export const ERROR_SNACKBAR_COLOR  = '#d32f2f' 
