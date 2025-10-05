import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import mstyles from './styles'
import { Colors } from '../../theme/color'
import base from '../../theme/style'

export default function AccountPromptRow({ text, cta, onPress }: { text: string; cta: string; onPress: () => void }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, justifyContent: 'center', marginTop: 30 }}>
            <Text style={[base.r16, { color: Colors.disable, textAlign: 'center' }]}>{text}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={[base.m16, { color: Colors.primary, textAlign: 'center' }]}> {cta}</Text>
            </TouchableOpacity>
        </View>
    )
}


