import a5 from "@/assets/avatars/a5.png";
import a6 from "@/assets/avatars/a6.png";
import a12 from "@/assets/avatars/a12.png";
import a14 from "@/assets/avatars/a14.png";
import a16 from "@/assets/avatars/a16.png";
import a18 from "@/assets/avatars/a18.png";
import a19 from "@/assets/avatars/a19.png";
import a20 from "@/assets/avatars/a20.png";
import a21 from "@/assets/avatars/a21.png";
import a22 from "@/assets/avatars/a22.png";
import a23 from "@/assets/avatars/a23.png";
import a24 from "@/assets/avatars/a24.png";
import defaultAvatar from "@/assets/avatars/default.png";

export const SIGN_UP_TITLE = "Sign Up";
export const LOGIN_TITLE = " Login";
export const LOGIN_HELPER_TEXT = "Already have an account?";

export const AVAILABLE_AVATARS = [
  "default.png",
  "a5.png",
  "a6.png",
  "a12.png",
  "a14.png",
  "a16.png",
  "a18.png",
  "a19.png",
  "a20.png",
  "a21.png",
  "a22.png",
  "a23.png",
  "a24.png",
];

export const avatarImages = {
  "default.png": defaultAvatar,
  "a5.png": a5,
  "a6.png": a6,
  "a12.png": a12,
  "a14.png": a14,
  "a16.png": a16,
  "a18.png": a18,
  "a19.png": a19,
  "a20.png": a20,
  "a21.png": a21,
  "a22.png": a22,
  "a23.png": a23,
  "a24.png": a24,
} as const;

type AvatarImageSource = typeof defaultAvatar;

export const getAvatarImage = (avatarName: string): AvatarImageSource => {
  const imageKey = avatarName as keyof typeof avatarImages;

  if (Object.prototype.hasOwnProperty.call(avatarImages, imageKey)) {
    return avatarImages[imageKey];
  }

  return defaultAvatar;
};
