import React from 'react'
import { Image, View, ImageStyle, ViewStyle } from 'react-native'
import { getAvatarImage } from '../molecules/constants'

type AvatarProps = {
    avatarName: string
    size?: number
    style?: ViewStyle
    imageStyle?: ImageStyle
}

export default function Avatar({ avatarName, size = 60, style, imageStyle }: AvatarProps) {
    const avatarImage = getAvatarImage(avatarName)
    
    const containerStyle: ViewStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        ...style
    }
    
    const imgStyle: ImageStyle = {
        width: size,
        height: size,
        ...imageStyle
    }

    return (
        <View style={containerStyle}>
            <Image
                source={avatarImage}
                style={imgStyle}
                resizeMode="contain"
            />
        </View>
    )
}
