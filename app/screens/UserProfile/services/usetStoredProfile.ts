import { Platform } from "react-native";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";

const isWeb = Platform.OS === "web";

export type StoredProfile = {
  id?: number;
  nickname?: string;
  email?: string;
  avatar?: string;
};

//TODO
//Change this implementation this is not a hook is a normal function

export async function getStoredProfile(): Promise<StoredProfile | null> {
  try {
    const manager = isWeb ? ProfileWebTokenManager : ProfileMobileTokenManager;
    const userdata = await manager.getUserProfile();

    if (userdata?.nickname || userdata?.email) {
      return {
        id: userdata.id,
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
