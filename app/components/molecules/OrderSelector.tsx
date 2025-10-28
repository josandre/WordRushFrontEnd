import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import moleculeStyles from './styles'

type OrderType = 'ascending' | 'descending'

type OrderSelectorProps = {
  selectedOrder: OrderType
  onOrderChange: (order: OrderType) => void
}

const ORDER_OPTIONS = [
  {
    value: 'ascending' as OrderType,
    label: 'Ascending (A-Z)',
    icon: 'arrow-up',
  },
  {
    value: 'descending' as OrderType,
    label: 'Descending (Z-A)',
    icon: 'arrow-down',
  },
]

export default function OrderSelector({
  selectedOrder,
  onOrderChange,
}: OrderSelectorProps) {
  return (
    <View>
      <Text style={[style.r16, { color: Colors.txt, marginBottom: 12 }]}>
        Letter Order
      </Text>
      
      <View style={moleculeStyles.orderSelectorContainer}>
        {ORDER_OPTIONS.map((option) => {
          const isSelected = selectedOrder === option.value
          
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onOrderChange(option.value)}
              style={[
                moleculeStyles.orderOption,
                {
                  backgroundColor: isSelected ? Colors.primary : Colors.bg,
                  borderColor: isSelected ? Colors.primary : '#E5E9EF',
                },
              ]}
            >
              <View style={moleculeStyles.orderOptionContent}>
                <Icon
                  name={option.icon}
                  size={20}
                  color={isSelected ? Colors.secondary : Colors.primary}
                />
                <Text
                  style={[
                    style.r16,
                    {
                      color: isSelected ? Colors.secondary : Colors.active,
                      marginLeft: 8,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </View>
              {isSelected && (
                <Icon name="checkmark" size={20} color={Colors.secondary} />
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
