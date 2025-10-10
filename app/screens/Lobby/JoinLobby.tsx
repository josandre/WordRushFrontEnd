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

//TODO: Add functionality
export default function JoinLobby() {
    const navigation = useNavigation<AppNavigation>();

    const [gameID, setGameID] = useState('')

    const isNonEmpty = (val: string) => val.trim().length > 0

    const gameIDError = isNonEmpty(gameID) ? '' : 'Enter a valid Game ID'

    function onJoin(): void {
        // TODO: Check if the room exists
        // TODO: Join the Game Room
        // TODO: Handle the case where the Room doesn't exist
        if (isNonEmpty(gameID)) {
            navigation.navigate('Lobby');
        }
    }

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary, }]}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

            <AppBar
                title='Join Game'
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
                    <InputField label='Game ID' value={gameID} onChangeText={setGameID} placeholder='' leftIconName='' error={gameIDError} />
                    <PrimaryButton title='Join Game' onPress={() => onJoin()} disabled={false} loading={false} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}