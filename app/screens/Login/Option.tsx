import { View, Text, Dimensions, StatusBar, KeyboardAvoidingView, ImageBackground, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../../theme/style'
import { Colors } from '../../theme/color'

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Option() {
    const navigation = useNavigation<AppNavigation>();

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
            <ImageBackground source={require('../../../assets/image/a1.png')} resizeMode='stretch' style={{ flex: 1 }}>
                <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                    <View style={{ flex: 1, margin: 18, justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: Colors.bg, borderRadius: 20, padding: 12 }}>
                            <Text style={[style.apptitle, { color: Colors.active, textAlign: 'center' }]}>Login or Sign Up</Text>
                            <Text style={[style.r16, { color: Colors.disable, textAlign: 'center' ,marginTop:5}]}>Login or create an account to take quiz, take part in challenge, and more.</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}
                                style={[style.btn, { marginTop: 20 }]}>
                                <Text style={[style.btntxt, {  }]}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}
                                style={[style.btn, { marginTop: 15 ,backgroundColor:Colors.btn}]}>
                                <Text style={[style.btntxt, { color:Colors.primary}]}>Create an account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}
                                style={[style.btn, { marginTop: 15 ,backgroundColor:Colors.bg}]}>
                                <Text style={[style.btntxt, {color:Colors.disable}]}>Later</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    )
}