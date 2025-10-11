import { StyleSheet, Dimensions, Platform } from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? windowWidth : screenWidth;


const isWeb = Platform.OS === 'web';
const isDesktop = width > 1024;
const maxContentWidth = isWeb && isDesktop ? 800 : width;

export default StyleSheet.create({
    slide: {
        width: maxContentWidth,
        ...(isWeb && {
            maxWidth: maxContentWidth,
            alignSelf: 'center'
        })
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        ...(isWeb && {
            minHeight: isDesktop ? 400 : 300
        })
    },
    image: {
        width: maxContentWidth - 40,
        alignSelf: 'center',
        ...(isWeb && {
            maxWidth: isDesktop ? 500 : 350,
            height: 'auto'
        })
    }
})



