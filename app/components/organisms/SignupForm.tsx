import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import TermsNotice from '../molecules/TermsNotice'
import AccountPromptRow from '../molecules/AccountPromptRow'
import InputField from '../molecules/InputField'
import PasswordField from '../molecules/PasswordField'
import PrimaryButton from '../atoms/PrimaryButton'
import { RegisterPayload } from '@/app/screens/Login/services/useRegisterUser'
import { ERROR_FORM_MESSAGES } from './constants'

type Props = {
    onSubmit: (form: RegisterPayload) => void
    onLogin: () => void
    loading?: boolean
}

export default function SignupForm({ onSubmit, onLogin, loading = false }: Props) {
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val)
    const isValidPassword = (val: string) => val.length >= 6
    const isNonEmpty = (val: string) => val.trim().length > 0
    const passwordsMatch = password === confirmPassword
    const isFormValid = isNonEmpty(nickname) && isValidEmail(email) && isValidPassword(password) && passwordsMatch
    const nicknameError = isNonEmpty(nickname) ? '' : ERROR_FORM_MESSAGES.NickName
    const emailError = isNonEmpty(email) ? (isValidEmail(email) ? '' : ERROR_FORM_MESSAGES.InvalidEmail) : ERROR_FORM_MESSAGES.RequiredEmail
    const passwordError = isNonEmpty(password) ? (isValidPassword(password) ? '' : ERROR_FORM_MESSAGES.PasswordValidation) : ERROR_FORM_MESSAGES.PasswordRequired
    const confirmError = isNonEmpty(confirmPassword) ? (passwordsMatch ? '' : ERROR_FORM_MESSAGES.PasswordMatchValidation) : ERROR_FORM_MESSAGES.PasswordConfirmation

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
            <InputField label='Nickname' value={nickname} onChangeText={setNickname} placeholder='Your nickname' leftIconName='person-outline' error={nicknameError} />
            <InputField label='Email Address' value={email} onChangeText={setEmail} error={emailError} />
            <PasswordField label='Password' value={password} onChangeText={setPassword} visible={showPassword} onToggleVisible={() => setShowPassword(!showPassword)} error={passwordError} />
            <PasswordField label='Confirm Password' value={confirmPassword} onChangeText={setConfirmPassword} visible={showConfirm} onToggleVisible={() => setShowConfirm(!showConfirm)} error={confirmError} />

            <PrimaryButton title='Create account' onPress={() => onSubmit({ userName: nickname, nickname, email, password })} disabled={!isFormValid || loading} loading={loading} />

            <AccountPromptRow text='Already have an account?' cta='Login' onPress={onLogin} />
            <TermsNotice />
        </ScrollView>
    )
}


