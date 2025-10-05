import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('screen').width

export default StyleSheet.create({
    slide: {
        width: width
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        width: width - 40,
        alignSelf: 'center'
    }
})


