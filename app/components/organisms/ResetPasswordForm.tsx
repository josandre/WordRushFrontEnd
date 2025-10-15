import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import PasswordField from '../molecules/PasswordField'
import InputField from '../molecules/InputField'
import PrimaryButton from '../atoms/PrimaryButton'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../theme/color'
import style from '../../theme/style'
import { ResetPasswordPayload } from '@/app/screens/Auth/ResetPassword/services/userResetPassword'

type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordPayload) => void
  loading?: boolean
}

export default function ResetPasswordForm({ onSubmit, loading = false }: ResetPasswordFormProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)
  
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = newPassword.length >= 8
  const isFormValid = isEmailValid && isPasswordValid && newPassword === confirmPassword && email.length > 0 && newPassword.length > 0 && confirmPassword.length > 0

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({ email, newPassword})
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          leftIconName="mail-outline"
          error={email.length > 0 && !isEmailValid ? "Please enter a valid email address" : undefined}
        />

        <View />

        <PasswordField
          label="Password"
          value={newPassword}
          onChangeText={setNewPassword}
          visible={isPasswordVisible}
          onToggleVisible={() => setIsPasswordVisible(!isPasswordVisible)}
          error={newPassword.length > 0 && !isPasswordValid ? "Must be at least 8 characters" : undefined}
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
          error={confirmPassword.length > 0 && newPassword !== confirmPassword ? "Passwords do not match" : undefined}
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
