import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import atomStyles from './styles'

type SelectOption = {
  label: string
  value: string | number
}

type SelectProps = {
  label: string
  value: string | number
  options: SelectOption[]
  onValueChange: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
}

export default function Select({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (option: SelectOption) => {
    onValueChange(option.value)
    setIsOpen(false)
  }

  return (
    <>
      <Text style={[style.r16, { color: Colors.txt, marginBottom: 8 }]}>{label}</Text>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        style={[
          atomStyles.selectContainer,
          {
            backgroundColor: Colors.bg,
            borderWidth: isFocused ? 2 : 1,
            borderColor: isFocused ? Colors.primary : '#E5E9EF',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text
          style={[
            style.r16,
            {
              color: selectedOption ? Colors.active : Colors.disable,
              flex: 1,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={atomStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={atomStyles.modalContent}>
            <View style={atomStyles.modalHeader}>
              <Text style={[style.subtitle, { color: Colors.txt }]}>{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Icon name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    atomStyles.selectOption,
                    {
                      backgroundColor: item.value === value ? Colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      style.r16,
                      {
                        color: item.value === value ? Colors.secondary : Colors.active,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Icon name="checkmark" size={20} color={Colors.secondary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}
