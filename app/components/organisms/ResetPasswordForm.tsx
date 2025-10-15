import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import PasswordField from '../molecules/PasswordField'
import PrimaryButton from '../atoms/PrimaryButton'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../theme/color'
import style from '../../theme/style'

type ResetPasswordFormProps = {
  onSubmit: (data: { password: string; confirmPassword: string }) => void
  loading?: boolean
}

export default function ResetPasswordForm({ onSubmit, loading = false }: ResetPasswordFormProps): React.JSX.Element {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)
  
  const isPasswordValid = password.length >= 8
  const isFormValid = isPasswordValid && password === confirmPassword && password.length > 0 && confirmPassword.length > 0

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({ password, confirmPassword })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          visible={isPasswordVisible}
          onToggleVisible={() => setIsPasswordVisible(!isPasswordVisible)}
          error={password.length > 0 && !isPasswordValid ? "Must be at least 8 characters" : undefined}
        />
        
        {/* Password requirement indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={[style.r14, { color: Colors.disable }]}>Must be at least 8 characters.</Text>
          <Icon name={isPasswordValid ? 'checkmark-sharp' : 'close-sharp'} size={20} color={isPasswordValid ? Colors.primary : Colors.disable} />
        </View>

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          visible={isConfirmPasswordVisible}
          onToggleVisible={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          error={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : undefined}
        />

        <PrimaryButton
          title="Reset Password"
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
          loading={loading}
        />
      </ScrollView>
    </View>
  )
}
