import React from 'react'
import { View, ImageBackground, Image, Dimensions, ImageSourcePropType } from 'react-native'
import PaginationDots from '../molecules/PaginationDots'
import AuthCTA from '../molecules/AuthCTA'
import ostyles from './styles'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

type IntroSlideProps = {
    background: ImageSourcePropType
    image: ImageSourcePropType
    dotsTotal: number
    dotsActiveIndex: number
    ctaTitle: string
    onSignUp: () => void
    onLogin: () => void
    imageHeightRatio?: number
}

export default function IntroSlide({ background, image, dotsTotal, dotsActiveIndex, ctaTitle, onSignUp, onLogin, imageHeightRatio = 3 }: IntroSlideProps) {
    return (
        <View style={ostyles.slide}>
            <ImageBackground source={background} resizeMode='stretch' style={{ flex: 1 }}>
                <View style={ostyles.imageWrapper}>
                    <Image source={image} resizeMode='stretch' style={[ostyles.image, { height: height / imageHeightRatio }]} />
                </View>

                <PaginationDots total={dotsTotal} activeIndex={dotsActiveIndex} />

                <AuthCTA title={ctaTitle} onSignUp={onSignUp} onLogin={onLogin} />
            </ImageBackground>
        </View>
    )
}



