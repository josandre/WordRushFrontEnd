import { View, Text, Dimensions, StatusBar, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../../theme/style'
import { Colors } from '../../theme/color'
import { AppBar } from '@react-native-material/core';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes'
import LoginForm from '../../components/organisms/LoginForm'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Login() {
    const navigation = useNavigation<AppNavigation>();

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title='Login'
                        titleStyle={[style.apptitle, { color: Colors.txt }]}
                        centerTitle={true}
                        style={{ backgroundColor: 'transparent' }}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Option')} />}
                    />
                    <LoginForm onLogin={() => navigation.navigate('MyTabs')} onForgot={() => navigation.navigate('Reset')} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}