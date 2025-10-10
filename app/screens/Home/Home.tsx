import { View, Text,  TextInput, Dimensions, ImageBackground, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'

import { useNavigation } from '@react-navigation/native';
import style from '@/app/theme/style';
import { Colors } from '@/app/theme/color';
import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

//TODO: Taylor to complete home screen. This is just a temp placeholder
export default function Home() {
    const navigation = useNavigation<AppNavigation>();

    function getUserName(): string {
        // TODO: Actually get the active user's username
        return "Guest";
    } 

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary, }]}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginHorizontal: 20 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Icon name='sunny-outline' size={20} color={Colors.lpink} />
                        <Text style={[style.m12, { color: Colors.lpink, marginLeft: 5 }]}>Welcome</Text>
                    </View>
                    <Text style={[style.apptitle, { color: Colors.secondary, }]}>{ getUserName() }</Text>
                </View>
                <Image source={require('../../../assets/image/s1.png')} resizeMode='stretch' style={{ height: 56, width: 56 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                <View style={{ padding: 20, backgroundColor: Colors.secondary, marginTop: 20,  borderRadius:20,marginBottom:20 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={[style.subtitle, { color: Colors.txt, flex: 1 }]}>Game</Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Lobby')} style={[style.box, {padding:12, borderRadius: 15, marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
                        <Image source={require('../../../assets/image/s43.png')} resizeMode='stretch' style={{ height: 64, width: 64 }} />
                        <View style={{ flex: 1 ,marginLeft:10}}>
                            <Text style={[style.m16, { color: Colors.txt,  }]}>Host Game</Text>
                            <Text style={[style.r12, { color: Colors.disable, marginTop:7}]}>Create a Lobby to play with your friends</Text>
                        </View>
                        <Icon name='chevron-forward' size={24} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('JoinLobby')} style={[style.box, {padding:12, borderRadius: 15, marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
                        <Image source={require('../../../assets/image/s39.png')} resizeMode='stretch' style={{ height: 64, width: 64 }} />
                        <View style={{ flex: 1 ,marginLeft:10}}>
                            <Text style={[style.m16, { color: Colors.txt,  }]}>Join Game</Text>
                            <Text style={[style.r12, { color: Colors.disable, marginTop:7}]}>Join into an existing Lobby to play with your friends</Text>
                        </View>
                        <Icon name='chevron-forward' size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}