import { View, Dimensions, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import style from '../../theme/style'
import { Colors } from '../../theme/color'
import { AppBar } from '@react-native-material/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigation } from '@/app/navigator/AppNavigationTypes'
import { keyboardBehavior } from './helpers'
import SignupForm from '@/app/components/organisms/SignupForm'
import { SIGN_UP_TITLE } from '@/app/components/molecules/constants'
import useRegisterUser, { RegisterPayload } from './services/useRegisterUser'
import { Snackbar } from '@react-native-material/core'
import styles, { ERROR_SNACKBAR_COLOR, SUCCESS_SNACKBAR_COLOR } from './styles'
import { FALLBACK_ERROR_MESSAGE, SnackBarProps } from './constants'

export default function Signup() {
    const navigation = useNavigation<AppNavigation>();
    const { register, loading, error, data } = useRegisterUser()
    const [snackbar, setSnackbar] = useState<SnackBarProps>({ visible: false, message: '' })

    const handleSubmit = async (form: RegisterPayload) => {
        const payload = {
            userName: form.nickname,
            email: form.email,
            password: form.password,
            nickname: form.nickname,
            avatar: ''
        }
        const result = await register(payload)
        if (result.success) {
            const successSnackBar: SnackBarProps = {
                visible: true,
                message: result.data?.Message || 'Registered',
                color: SUCCESS_SNACKBAR_COLOR
            }

            setSnackbar(successSnackBar)
            navigation.navigate('Login', { fromRegisterSuccess: true })
        } else {    
            const errorSnackBar: SnackBarProps = {
                visible: true,
                message: result.errorMessage,
                color: ERROR_SNACKBAR_COLOR
            }
            setSnackbar(errorSnackBar)
        }
    }

    return (
        <SafeAreaView style={[style.area, { backgroundColor: Colors.bord }]}>
            <StatusBar backgroundColor='transparent' translucent={true} barStyle={'dark-content'} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior()}>
                <View style={[style.main, { backgroundColor: Colors.bord, marginTop: Platform.OS === 'ios' ? 10 : 30 }]}>
                    <AppBar
                        title={SIGN_UP_TITLE}
                        titleStyle={[style.apptitle, { color: Colors.txt }]}
                        centerTitle={true}
                        style={{ backgroundColor: 'transparent' }}
                        elevation={0}
                    />

                    <SignupForm onLogin={() => navigation.navigate('Login', { fromRegisterSuccess: false })} onSubmit={handleSubmit} loading={loading} />

                    {snackbar.visible && (
                        <Snackbar message={snackbar.message ?? FALLBACK_ERROR_MESSAGE} style={[styles.snackbarContainer, { backgroundColor: snackbar.color }]}/>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}