import { Dimensions } from 'react-native'
import React, {  } from 'react'
import style from '@/app/theme/style';
import { Colors } from '@/app/theme/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import useGameControllerTest from './services/useGameControllerTest';

//TODO: Taylor to complete home screen. This is just a temp placeholder
export default function Home() {
    const {games, loading, error, data} = useGameControllerTest()

    games().then((result) => {
        //TEST AUTH HEADER
    })

    

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
        </SafeAreaView>
    )
}