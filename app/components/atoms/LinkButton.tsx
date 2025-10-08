import React from 'react'
import { TouchableOpacity, Text, GestureResponderEvent, TextStyle, ViewStyle } from 'react-native'
import atoms from './styles'
import { webButtonStyles, getWebPointerStyles } from '../../utils/webStyles'

type LinkButtonProps = {
    title: string
    onPress?: (event: GestureResponderEvent) => void
    containerStyle?: ViewStyle
    textStyle?: TextStyle
}

export default function LinkButton({ title, onPress, containerStyle, textStyle }: LinkButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[containerStyle, webButtonStyles, getWebPointerStyles()]}>
            <Text style={[atoms.linkText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}



