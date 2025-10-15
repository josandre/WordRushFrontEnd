import React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '../../theme/color'
import base from '../../theme/style'
import OptionActions from '../molecules/OptionActions'

type OptionCardProps = {
    title: string
    subtitle: string
    onLogin: () => void
    onSignup: () => void
}

export default function OptionCard({ title, subtitle, onLogin, onSignup }: OptionCardProps) {
    return (
        <View style={{ backgroundColor: Colors.bg, borderRadius: 20, padding: 12 }}>
            <Text style={[base.apptitle, { color: Colors.active, textAlign: 'center' }]}>{title}</Text>
            <Text style={[base.r16, { color: Colors.disable, textAlign: 'center', marginTop: 5 }]}>{subtitle}</Text>
            <OptionActions onLogin={onLogin} onSignup={onSignup} />
        </View>
    )
}




