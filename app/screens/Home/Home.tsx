import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { Colors } from '@/app/theme/color'
import style from '@/app/theme/style'
import useGameControllerTest, { TestResponse } from './services/useGameControllerTest'

export default function Home() {
  const { games, loading, error, data } = useGameControllerTest()
  const [result, setResult] = useState<TestResponse | undefined>()


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
    </SafeAreaView>
  )
}
