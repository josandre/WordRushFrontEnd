import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import TermsNotice from "../molecules/TermsNotice";
import InputField from "../molecules/InputField";
import PrimaryButton from "../atoms/PrimaryButton";
import AvatarPicker from "../molecules/AvatarPicker";
import { ERROR_FORM_MESSAGES } from "./constants";
import { ProfileUserResponse } from "@/app/screens/UserProfile/services/useProfileUser";
import { AvatarId } from "@/assets/avatars";

type Props = {
  user?: ProfileUserResponse;
  avatar?: AvatarId; // preselected avatar
  onSubmit: (form: ProfileUserResponse) => void;
  onLogin: () => void;
  loading?: boolean;
};

export default function UpdateForm({
  user,
  avatar,
  onSubmit,
  onLogin,
  loading = false,
}: Props) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(
    avatar ?? "default"
  );

  // Preload current user info, including avatar
  useEffect(() => {
    if (user) {
      setNickname(user.nickname ?? "");
      setEmail(user.email ?? "");
      if (user.avatar && Object.keys(AvatarIdMap).includes(user.avatar)) {
        setSelectedAvatar(user.avatar as AvatarId);
      } else if (avatar) {
        setSelectedAvatar(avatar); // fallback to prop
      }
    }
  }, [user, avatar]);

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
      {/* Avatar Picker */}
      <AvatarPicker avatar={selectedAvatar} onChange={setSelectedAvatar} />

      {/* Nickname Input */}
      <InputField
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholder="Your nickname"
        leftIconName="person-outline"
        error={nicknameError}
      />

      {/* Email Input */}
      <InputField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        leftIconName="mail-outline"
        error={emailError}
      />

      {/* Submit Button */}
      <PrimaryButton
        title="Update Profile"
        onPress={() =>
          onSubmit({
            ...user,
            nickname,
            email,
            avatar: selectedAvatar,
          } as ProfileUserResponse)
        }
        disabled={!isFormValid || loading}
        loading={loading}
      />

      <TermsNotice />
    </ScrollView>
  );
}

// Map of valid AvatarIds for type checking
const AvatarIdMap: Record<string, boolean> = {
  default: true,
  a5: true,
  a6: true,
  a12: true,
  a14: true,
  a16: true,
  a18: true,
  a19: true,
  a20: true,
  a21: true,
  a22: true,
  a23: true,
  a24: true,
};
