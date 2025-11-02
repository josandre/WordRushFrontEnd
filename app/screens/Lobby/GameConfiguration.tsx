import React, { useState } from 'react'
import { StatusBar, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppNavigation } from '../../navigator/AppNavigationTypes'
import ScreenTitleBar from '../../components/molecules/ScreenTitleBar'
import GameConfigurationContent from '../../components/organisms/GameConfigurationContent'
import styles from './styles'

import { useRoute } from '@react-navigation/native';

type GameConfigurationData = {
  timeLimit: number
  selectedLetters: string[]
  letterOrder: 'ascending' | 'descending'
}

type RouteParams = {
  roomId: string; 
};

export default function GameConfiguration() {
  const navigation = useNavigation<AppNavigation>()
  const [loading, setLoading] = useState(false)

  const [timeLimit, setTimeLimit] = useState<number>(45)
  const [selectedLetters, setSelectedLetters] = useState<string[]>(['A'])
  const [letterOrder, setLetterOrder] = useState<'ascending' | 'descending'>('ascending')

  const route = useRoute();
  const { roomId } = route.params as RouteParams;

  const handleLetterToggle = (letter: string) => {
    setSelectedLetters(prev => {
      if (prev.includes(letter)) {
        return prev.filter(l => l !== letter)
      } else if (prev.length < 5) {
        return [...prev, letter]
      }
      return prev
    })
  }

  const handleSaveConfiguration = () => {
    setLoading(true)
    const configuration: GameConfigurationData = {
      timeLimit,
      selectedLetters,
      letterOrder,
    }
    
    console.log('Game Configuration:', configuration)
    // TODO: Save configuration to state management or send to server
    setTimeout(() => {
      setLoading(false)
      navigation.navigate('Lobby', { 
        isOwner: true, 
        roomId: roomId })
    }, 1000)
  }

  const handleDiscardChanges = () => {
    // Reset to default values
    setTimeLimit(45)
    setSelectedLetters(['A'])
    setLetterOrder('ascending')
    navigation.navigate('Lobby', { 
      isOwner: true, 
      roomId: roomId 
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={styles.statusBar.translucent}
        backgroundColor={styles.statusBar.backgroundColor}
        barStyle="light-content"
      />

      <ScreenTitleBar
        screenName="Configure Game"
        onGoBackPress={() => navigation.navigate('Lobby', { 
          isOwner: true, 
          roomId: roomId })}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <GameConfigurationContent
          timeLimit={timeLimit}
          selectedLetters={selectedLetters}
          letterOrder={letterOrder}
          onTimeLimitChange={setTimeLimit}
          onLetterToggle={handleLetterToggle}
          onOrderChange={setLetterOrder}
          onSaveConfiguration={handleSaveConfiguration}
          onDiscardChanges={handleDiscardChanges}
          loading={loading}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
