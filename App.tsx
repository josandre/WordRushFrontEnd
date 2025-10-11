import 'react-native-gesture-handler';
import React from 'react'
import { Platform } from 'react-native';
import StackNavigator from '@/app/navigator/StackNavigator';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export default function App() {
  return (
    <StackNavigator/>
  )
}