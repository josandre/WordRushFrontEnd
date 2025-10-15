import { View, Text, StatusBar, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../../../theme/style'
import { Colors } from '../../../theme/color'
import Icon from 'react-native-vector-icons/Ionicons'
import { AppBar } from '@react-native-material/core'
import { SafeAreaView } from 'react-native-safe-area-context'
import ResetPasswordForm from '../../../components/organisms/ResetPasswordForm'
import resetPasswordStyles from './ResetPasswordStyles'
import { AppNavigation } from '../../../navigator/AppNavigationTypes'


type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

export default function ResetPassword(): React.JSX.Element {
  const navigation = useNavigation<AppNavigation>()

  const handlePasswordReset = (data: ResetPasswordFormData) => {
    // TODO: Implement password reset logic
    console.log('Password reset data:', data)
    // For now, navigate back to login
    navigation.navigate('Login', { fromRegisterSuccess: false })
  }

  return (
    <SafeAreaView style={[style.area, resetPasswordStyles.container]}>
      <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
      <KeyboardAvoidingView style={resetPasswordStyles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[style.main, resetPasswordStyles.main]}>
          <AppBar
            title='New Password'
            titleStyle={[style.apptitle, resetPasswordStyles.appTitle]}
            centerTitle={true}
            style={resetPasswordStyles.appBar}
            elevation={0}
            leading={
              <TouchableOpacity onPress={() => navigation.navigate('Login', { fromRegisterSuccess: false })} style={resetPasswordStyles.backButton}>
                <Icon name='arrow-back' size={24} color={Colors.active} />
              </TouchableOpacity>
            }
          />

          <ResetPasswordForm onSubmit={handlePasswordReset} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}