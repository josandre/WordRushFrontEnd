import React from 'react'
import { TouchableOpacity, Text, GestureResponderEvent, ViewStyle, TextStyle, ActivityIndicator } from 'react-native'
import style from '../../theme/style'
import { Colors } from '../../theme/color'

type PrimaryButtonProps = {
    title: string
    onPress?: (event: GestureResponderEvent) => void
    textStyle?: TextStyle
    disabled?: boolean
    loading?: boolean
}

export default function PrimaryButton({ title, onPress, textStyle, disabled, loading }: PrimaryButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[style.btn, style.container, (disabled || loading) ? { opacity: 0.5 } : null]}> 
            {loading ? (
                <ActivityIndicator color={Colors.secondary} />
            ) : (
                <Text style={[style.btntxt, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}



