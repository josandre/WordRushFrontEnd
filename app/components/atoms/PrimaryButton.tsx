import React from 'react'
import { TouchableOpacity, Text, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native'
import style from '../../theme/style'

type PrimaryButtonProps = {
    title: string
    onPress?: (event: GestureResponderEvent) => void
    containerStyle?: ViewStyle
    textStyle?: TextStyle
}

export default function PrimaryButton({ title, onPress, containerStyle, textStyle }: PrimaryButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[style.btn, containerStyle]}> 
            <Text style={[style.btntxt, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}



