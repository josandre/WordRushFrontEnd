import { Dimensions } from 'react-native'
import React, {  } from 'react'
import style from '@/app/theme/style';
import { Colors } from '@/app/theme/color';

import { SafeAreaView } from 'react-native-safe-area-context';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

//TODO: Taylor to complete home screen. This is just a temp placeholder
export default function Home() {
    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
        </SafeAreaView>
    )
}