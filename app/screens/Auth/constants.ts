import bgImageWithLogo from "../../../assets/image/bg1.png";
import bgImageWithoutLogo from "../../../assets/image/bge.png";
import bgImage from "../../../assets/image/bg3.png";

export const TITLE = "Login or Sign Up";
export const IMAGE_BG_WITH_LOGO = bgImageWithLogo;
export const IMAGE_BG = bgImage;
export const IMAGE_BG_WO = bgImageWithoutLogo;
export const HELPER_TEXT =
  "Login or create an account to start creating WordsRush games.";
export type SnackBarProps = {
  visible: boolean;
  message?: string;
  color?: string;
};

export const FALLBACK_ERROR_MESSAGE = "An error occured processing the login";
