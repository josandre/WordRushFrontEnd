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

    if (userdata?.email || userdata?.nickname) {
      return {
        nickname: userdata.nickname ?? "Guest",
        email: userdata.email ?? "",
        avatar: userdata.avatar ?? "",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to load stored profile:", error);
    return null;
  }
}
