import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Colors } from '@/app/theme/color'

import { AppNavigation } from '@/app/navigator/AppNavigationTypes';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import style from '@/app/theme/style'
import useGameControllerTest, { TestResponse } from './services/useGameControllerTest'

export default function Home() {
    const navigation = useNavigation<AppNavigation>();
    const { games, loading, error, data } = useGameControllerTest()
    const [result, setResult] = useState<TestResponse | undefined>()

    function getUserName(): string {
        // TODO: Actually get the active user's username
        return "Guest";
    } 

    // THIS IS JUST FOR TESTING AUTH INTERCEPTOR< IT SHOULD BE REMOVED
    useEffect(() => {
        const fetchGames = async () => {
        try {
            const res = await games()
            setResult(res.data)
            console.log('JAC', res.data)
        } catch (err) {
            console.error('Error fetching games:', err)
        }
        }

    fetchGames()
  }, []) // 👈 empty dependency array = run once on mount

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <Text style={{ color: Colors.bg, fontSize: 16, textAlign: 'center', margin: 20 }}>
        {loading && 'Loading...'}
        {error && 'Error loading games'}
        {result?.name}
      </Text>

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
