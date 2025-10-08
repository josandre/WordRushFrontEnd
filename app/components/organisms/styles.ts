import { StyleSheet, Dimensions, Platform } from 'react-native'

// Get responsive dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Use appropriate dimensions for each platform
const width = Platform.OS === 'web' ? windowWidth : screenWidth;
const height = Platform.OS === 'web' ? windowHeight : screenHeight;

// Web-specific responsive values
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



