import React, { useState } from "react";
import { ScrollView } from "react-native";
import TermsNotice from "../molecules/TermsNotice";
import InputField from "../molecules/InputField";
import PrimaryButton from "../atoms/PrimaryButton";
//import { RegisterPayload } from "@/app/screens/Login/services/useRegisterUser";
import { ERROR_FORM_MESSAGES } from "./constants";
import {
  ProfileUserPayload,
  ProfileUserResponse,
} from "@/app/screens/UserProfile/services/useProfileUser";

type Props = {
  onSubmit: (form: ProfileUserResponse) => void;
  onLogin: () => void;
  loading?: boolean;
};

export default function UpdateForm({ onSubmit, loading = false }: Props) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  //const [showConfirm, setShowConfirm] = useState(false);
  const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val);
  const isNonEmpty = (val: string) => val.trim().length > 0;

  const isFormValid = isNonEmpty(nickname) && isValidEmail(email);
  const nicknameError = isNonEmpty(nickname)
    ? ""
    : ERROR_FORM_MESSAGES.NickName;
  const emailError = isNonEmpty(email)
    ? isValidEmail(email)
      ? ""
      : ERROR_FORM_MESSAGES.InvalidEmail
    : ERROR_FORM_MESSAGES.RequiredEmail;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
      <InputField
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholder="Your nickname"
        leftIconName="person-outline"
        error={nicknameError}
      />
      <InputField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />

      <PrimaryButton
        title="Update Profile"
        onPress={() => onSubmit({ nickname: nickname, email })}
        disabled={!isFormValid || loading}
        loading={loading}
      />
      <TermsNotice />
    </ScrollView>
  );
}
