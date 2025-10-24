import { Platform } from "react-native";
import ProfileWebTokenManager from "@/app/TokenManagers/web/ProfileWebTokenManager";
import ProfileMobileTokenManager from "@/app/TokenManagers/mobile/ProfileMobileTokenManager";

const isWeb = Platform.OS === "web";

export type StoredProfile = {
  nickname?: string;
  email?: string;
  avatar?: string;
};

export async function getStoredProfile(): Promise<StoredProfile | null> {
  try {
    const manager = isWeb ? ProfileWebTokenManager : ProfileMobileTokenManager;
    const userdata = await manager.getUserProfile();

    if (userdata?.nickname || userdata?.email) {
      return {
        nickname: userdata.nickname ?? "Player",
        email: userdata.email ?? "",
        avatar: userdata.avatar ?? "default",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to load stored profile:", error);
    return null;
  }
}
