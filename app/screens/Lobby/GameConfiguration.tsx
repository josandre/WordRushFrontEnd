import React, { useState } from 'react'
import { StatusBar, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Snackbar } from '@react-native-material/core'
import { AppNavigation } from '../../navigator/AppNavigationTypes'
import ScreenTitleBar from '../../components/molecules/ScreenTitleBar'
import GameConfigurationContent from '../../components/organisms/GameConfigurationContent'
import useUpdateGameSettings from './services/useUpdateGameSettings'
import { GameOrder } from './services/constants'
import styles, { ERROR_SNACKBAR_COLOR } from './styles'

type SnackBarProps = {
  visible: boolean;
  message?: string;
  color?: string;
};

const FALLBACK_ERROR_MESSAGE = "An error occurred updating game settings";

type RouteParams = {
  roomId: string; 
};

export default function GameConfiguration() {
  const navigation = useNavigation<AppNavigation>()
  const route = useRoute();
  const { roomId } = (route.params as RouteParams) || { roomId: '' };
  const { updateGameSettings, loading } = useUpdateGameSettings()
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  })

  const [timeLimit, setTimeLimit] = useState<number>(45)
  const [selectedLetters, setSelectedLetters] = useState<string[]>(['A'])
  const [letterOrder, setLetterOrder] = useState<'ascending' | 'descending'>('ascending')

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

  const handleSaveConfiguration = async () => {
    
    const gameOrder = letterOrder === 'ascending' 
      ? GameOrder.Ascending 
      : GameOrder.Descending

    const payload = {
      RoomId: roomId,
      Settings: {
        Letters: selectedLetters,
        TimeLimit: timeLimit,
        Order: gameOrder,
      },
    }

    const result = await updateGameSettings(payload)

    if (result.success) {
      navigation.navigate('Lobby', { 
        isOwner: true, 
        roomId: roomId 
      })
    } else {
      const errorSnackBar: SnackBarProps = {
        visible: true,
        message: result.errorMessage,
        color: ERROR_SNACKBAR_COLOR,
      };
      setSnackbar(errorSnackBar);
    }
  }

  const handleDiscardChanges = () => {
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

      {snackbar.visible && (
        <Snackbar
          message={snackbar.message ?? FALLBACK_ERROR_MESSAGE}
          style={[
            styles.snackbarContainer,
            { backgroundColor: snackbar.color },
          ]}
        />
      )}
    </SafeAreaView>
  )
}
