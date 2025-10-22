import React, { useState } from "react";
import { FlatList, View } from "react-native";
import TermsNotice from "../molecules/TermsNotice";
import AccountPromptRow from "../molecules/AccountPromptRow";
import InputField from "../molecules/InputField";
import PasswordField from "../molecules/PasswordField";
import AvatarSelector from "../molecules/AvatarSelector";
import PrimaryButton from "../atoms/PrimaryButton";
import { RegisterPayload } from "@/app/screens/Auth/services/useRegisterUser";
import { ERROR_FORM_MESSAGES } from "./constants";
import { useFeatureFlags } from "@/app/providers/FeatureFlagsProvider";
import { AVAILABLE_AVATARS } from "../molecules/constants";

type Props = {
  onSubmit: (form: RegisterPayload) => void;
  onLogin: () => void;
  loading?: boolean;
};

export default function SignupForm({
  onSubmit,
  onLogin,
  loading = false,
}: Props) {
  const { flags } = useFeatureFlags();
  const isAvatarEnabled = flags.EnableAvatars;
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    isAvatarEnabled ? "" : AVAILABLE_AVATARS[0],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val);
  const isValidPassword = (val: string) => val.length >= 6;
  const isNonEmpty = (val: string) => val.trim().length > 0;
  const passwordsMatch = password === confirmPassword;
  const isAvatarValid = isAvatarEnabled ? isNonEmpty(selectedAvatar) : true;
  const isFormValid =
    isNonEmpty(nickname) &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    passwordsMatch &&
    isAvatarValid;
  const nicknameError = isNonEmpty(nickname)
    ? ""
    : ERROR_FORM_MESSAGES.NickName;
  const emailError = isNonEmpty(email)
    ? isValidEmail(email)
      ? ""
      : ERROR_FORM_MESSAGES.InvalidEmail
    : ERROR_FORM_MESSAGES.RequiredEmail;
  const passwordError = isNonEmpty(password)
    ? isValidPassword(password)
      ? ""
      : ERROR_FORM_MESSAGES.PasswordValidation
    : ERROR_FORM_MESSAGES.PasswordRequired;
  const confirmError = isNonEmpty(confirmPassword)
    ? passwordsMatch
      ? ""
      : ERROR_FORM_MESSAGES.PasswordMatchValidation
    : ERROR_FORM_MESSAGES.PasswordConfirmation;

  const formItems = [
    {
      id: "nickname",
      component: (
        <InputField
          label="Nickname"
          value={nickname}
          onChangeText={setNickname}
          placeholder="Your nickname"
          leftIconName="person-outline"
          error={nicknameError}
        />
      ),
    },
    {
      id: "email",
      component: (
        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
      ),
    },
    {
      id: "password",
      component: (
        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          visible={showPassword}
          onToggleVisible={() => setShowPassword(!showPassword)}
          error={passwordError}
        />
      ),
    },
    {
      id: "confirmPassword",
      component: (
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          visible={showConfirm}
          onToggleVisible={() => setShowConfirm(!showConfirm)}
          error={confirmError}
        />
      ),
    },
    ...(isAvatarEnabled
      ? [
          {
            id: "avatar",
            component: (
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onAvatarSelect={setSelectedAvatar}
              />
            ),
          },
        ]
      : []),
    {
      id: "submit",
      component: (
        <PrimaryButton
          title="Create account"
          onPress={() =>
            onSubmit({
              userName: nickname,
              nickname,
              email,
              password,
              avatar: selectedAvatar,
            })
          }
          disabled={!isFormValid || loading}
          loading={loading}
        />
      ),
    },
    {
      id: "accountPrompt",
      component: (
        <AccountPromptRow
          text="Already have an account?"
          cta="Login"
          onPress={onLogin}
        />
      ),
    },
    { id: "terms", component: <TermsNotice /> },
  ];

  const renderFormItem = ({ item }: { item: any }) => (
    <View style={{ marginBottom: item.id === "terms" ? 0 : 20 }}>
      {item.component}
    </View>
  );

  return (
    <FlatList
      data={formItems}
      renderItem={renderFormItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10 }}
    />
  );
}
