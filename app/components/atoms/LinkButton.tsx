import React from 'react'
import { TouchableOpacity, Text, GestureResponderEvent, TextStyle, ViewStyle } from 'react-native'
import atoms from './styles'

type LinkButtonProps = {
    title: string
    onPress?: (event: GestureResponderEvent) => void
    containerStyle?: ViewStyle
    textStyle?: TextStyle
}

export default function LinkButton({ title, onPress, containerStyle, textStyle }: LinkButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={containerStyle}>
            <Text style={[atoms.linkText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}



