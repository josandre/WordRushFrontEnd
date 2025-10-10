import { View, Text,  TextInput, Dimensions, ImageBackground, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'

import { useNavigation } from '@react-navigation/native';
import style from '@/app/theme/style';
import { Colors } from '@/app/theme/color';
import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes';

import InputField from '../../components/molecules/InputField'
import PrimaryButton from '../../components/atoms/PrimaryButton'
import { AppBar } from '@react-native-material/core';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

// TODO: Add functionality
// TODO: Display list of players
// TODO: Posibility to configure game settings if you are the host
export default function Lobby() {
    const navigation = useNavigation<AppNavigation>();

    const [gameID, setGameID] = useState('')

    const isNonEmpty = (val: string) => val.trim().length > 0

    const gameIDError = isNonEmpty(gameID) ? '' : 'Enter a valid Game ID'

    function onConfigureGame(): void {
        navigation.navigate('ConfigureLobby');
    }
    
    function onStartGame(): void {
        // TODO: 
    }

    function getGameID(): string {
        // TODO: Actually get the lobby id
        return "AB1234"
    }

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary, }]}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

            <AppBar
                title='Game Lobby'
                titleStyle={[style.apptitle, { color: Colors.secondary, marginLeft: 25 }]}
                centerTitle={true}
                style={{ backgroundColor: 'transparent' }}
                elevation={0}
                leading={<TouchableOpacity onPress={() => navigation.navigate('MyTabs')} >
                    <Icon name='arrow-back' size={24} color={Colors.secondary} />
                </TouchableOpacity>}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                <View style={{ padding: 20, backgroundColor: Colors.secondary, marginTop: 20,  borderRadius:20,marginBottom:20 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={[style.subtitle, { color: Colors.txt, flex: 1 }]}>Game ID: { getGameID() }</Text>
                    </View>

                    <PrimaryButton title='Configure Game' onPress={() => onConfigureGame()} disabled={false} loading={false} />
                    <PrimaryButton title='Start Game' onPress={() => onStartGame()} disabled={false} loading={false} />
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={[style.subtitle, { color: Colors.txt, flex: 1 }]}>Players list</Text>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                        <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>Player 1</Text>
                        <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>Player 2</Text>
                        <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>Player 3</Text>
                        <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>Player 4</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}