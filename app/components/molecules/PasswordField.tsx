import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/Ionicons'
import mstyles from './styles'
import { Colors } from '../../theme/color'

type PasswordFieldProps = {
    label: string
    value?: string
    onChangeText?: (text: string) => void
    visible: boolean
    onToggleVisible: () => void
    error?: string
}

export default function PasswordField({ label, value, onChangeText, visible, onToggleVisible, error }: PasswordFieldProps) {
    const [isFocused, setIsFocused] = useState(false)
    
    return (
        <>
            <Text style={[mstyles.fieldLabel, { color: Colors.txt, marginTop: 20 }]}>{label}</Text>
            <View style={[
                mstyles.fieldContainer, 
                { 
                    backgroundColor: Colors.bg,
                    borderWidth: isFocused ? 2 : 1,
                    borderColor: isFocused ? Colors.primary : '#E5E9EF'
                }
            ]}> 
                <Icons name='lock-outline' size={24} color={Colors.primary} />
                <TextInput
                    placeholder='Your password'
                    placeholderTextColor={Colors.disable}
                    selectionColor={Colors.primary}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={!visible}
                    style={[mstyles.textInput, { color: Colors.active, outline: 'none' }]}
                />
                <TouchableOpacity onPress={onToggleVisible}>
                    <Icon name={!visible ? 'eye-off' : 'eye'} color={'#CCCCCC'} size={20} />
                </TouchableOpacity>
            </View>
            {!!error && <Text style={mstyles.errorText}>{error}</Text>}
        </>
    )
}


