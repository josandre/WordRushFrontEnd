import React from 'react'
import { View, Text } from 'react-native'
import ContentCard from '../atoms/ContentCard'
import Select from '../atoms/Select'
import LetterSelector from '../molecules/LetterSelector'
import OrderSelector from '../molecules/OrderSelector'
import PrimaryButton from '../atoms/PrimaryButton'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import styles from './GameConfigurationStyles'

type GameConfigurationData = {
  timeLimit: number
  selectedLetters: string[]
  letterOrder: 'ascending' | 'descending'
}

type GameConfigurationContentProps = {
  timeLimit: number
  selectedLetters: string[]
  letterOrder: 'ascending' | 'descending'
  onTimeLimitChange: (value: number) => void
  onLetterToggle: (letter: string) => void
  onOrderChange: (order: 'ascending' | 'descending') => void
  onSaveConfiguration: () => void
  onDiscardChanges: () => void
  loading?: boolean
  disabled?: boolean
}

// Time options from 45 to 60 seconds in increments of 5
const TIME_OPTIONS = [
  { label: '45 seconds', value: 45 },
  { label: '50 seconds', value: 50 },
  { label: '55 seconds', value: 55 },
  { label: '60 seconds', value: 60 },
]

export default function GameConfigurationContent({
  timeLimit,
  selectedLetters,
  letterOrder,
  onTimeLimitChange,
  onLetterToggle,
  onOrderChange,
  onSaveConfiguration,
  onDiscardChanges,
  loading = false,
  disabled = false
}: GameConfigurationContentProps) {
  const isConfigurationValid = selectedLetters.length > 0

  return (
    <View style={styles.container}>
      <ContentCard
        title="Game Settings"
        content={
          <View style={styles.content}>
            {/* Time Limit Selection */}
            <View style={styles.section}>
              <Select
                label="Time Limit"
                value={timeLimit}
                options={TIME_OPTIONS}
                onValueChange={(value) => onTimeLimitChange(value as number)}
                placeholder="Select time limit"
              />
            </View>

            {/* Letter Selection */}
            <View style={styles.section}>
              <LetterSelector
                selectedLetters={selectedLetters}
                onLetterToggle={onLetterToggle}
                maxSelection={5}
              />
            </View>

            {/* Letter Order Selection */}
            <View style={styles.section}>
              <OrderSelector
                selectedOrder={letterOrder}
                onOrderChange={onOrderChange}
              />
            </View>

            {/* Configuration Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>
                Configuration Summary
              </Text>
              <Text style={styles.summaryText}>
                Time Limit: {timeLimit} seconds
              </Text>
              <Text style={styles.summaryText}>
                Selected Letters: {selectedLetters.join(', ')}
              </Text>
              <Text style={styles.summaryText}>
                Order: {letterOrder === 'ascending' ? 'A-Z' : 'Z-A'}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Save Configuration"
                  onPress={onSaveConfiguration}
                  disabled={!isConfigurationValid || disabled || loading}
                  loading={loading}
                />
              </View>
              
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  title="Discard Changes"
                  onPress={onDiscardChanges}
                  disabled={disabled || loading}
                  style={styles.discardButton}
                />
              </View>
            </View>
          </View>
        }
      />
    </View>
  )
}
