import { Dimensions, StatusBar, ScrollView } from 'react-native'
import React from 'react'
import style from '../../theme/style';
import { Colors } from '../../theme/color';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes';
import IntroSlide from '../../components/organisms/IntroSlide';
import { FIRST_SLICE_TITLE, SECOND_SLICE_TITLE, INTRO_BG, INTRO_IMG_1, INTRO_IMG_2 } from './constants';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Introduction() {
    const navigation = useNavigation<AppNavigation>();

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bg, }]}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled={true}>
                <IntroSlide
                    background={INTRO_BG}
                    image={INTRO_IMG_1}
                    dotsTotal={2}
                    dotsActiveIndex={0}
                    ctaTitle={FIRST_SLICE_TITLE}
                    onSignUp={() => navigation.navigate('Option')}
                    onLogin={() => navigation.navigate('Option')}
                    imageHeightRatio={3}
                />
                <IntroSlide
                    background={INTRO_BG}
                    image={INTRO_IMG_2}
                    dotsTotal={2}
                    dotsActiveIndex={2}
                    ctaTitle={SECOND_SLICE_TITLE}
                    onSignUp={() => navigation.navigate('Option')}
                    onLogin={() => navigation.navigate('Option')}
                    imageHeightRatio={3}
                />
            </ScrollView>
        </SafeAreaView>
    )
}