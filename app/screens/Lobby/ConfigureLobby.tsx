import { View, Text,  TextInput, Dimensions, ImageBackground, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useContext } from 'react'

import { useNavigation } from '@react-navigation/native';
import style from '@/app/theme/style';
import { Colors } from '@/app/theme/color';
import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes';

import { AppBar } from '@react-native-material/core';

import InputField from '../../components/molecules/InputField'
import PrimaryButton from '../../components/atoms/PrimaryButton'

//TODO: Add functionality
export default function ConfigureLobby() {
    const navigation = useNavigation<AppNavigation>();

    const [gameID, setGameID] = useState('')

    const isNonEmpty = (val: string) => val.trim().length > 0

    const gameIDError = isNonEmpty(gameID) ? '' : 'Enter a valid Game ID'

    function onAccept(): void {
        // TODO: Notify the server about the changes and save them
        navigation.navigate('Lobby');
    }

    function onDiscard(): void {
        navigation.navigate('Lobby');
    }

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary, }]}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

            <AppBar
                title='Configure Lobby'
                titleStyle={[style.apptitle, { color: Colors.secondary, marginLeft: 25 }]}
                centerTitle={true}
                style={{ backgroundColor: 'transparent' }}
                elevation={0}
                leading={<TouchableOpacity onPress={() => navigation.navigate('Lobby')} >
                    <Icon name='arrow-back' size={24} color={Colors.secondary} />
                </TouchableOpacity>}
            />
            
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                <View style={{ padding: 20, backgroundColor: Colors.secondary, marginTop: 20,  borderRadius:20,marginBottom:20 }}>
                    <Text style={[style.r16, { color: Colors.txt, flex: 1 }]}>Here you will see the lobby settings</Text>
                    <PrimaryButton title='Save Changes' onPress={() => onAccept()} disabled={false} loading={false} />
                    <PrimaryButton title='Discard Changes' onPress={() => onDiscard()} disabled={false} loading={false} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}