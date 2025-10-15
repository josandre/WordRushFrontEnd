import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import Storage from "./MobileToken";

export default class ProfileMobileTokenManager {
  private static storage = new Storage<ProfileUserResponse>("UserProfile");

  static saveProfile = async (UserProfile?: ProfileUserResponse) => {
    if (UserProfile) {
      await this.storage.setValue(UserProfile);
    }
  };
  static async getUserProfile() {
    try {
      const UserProfile = await this.storage.getValue();
      return UserProfile ? UserProfile : null;
    } catch (e) {
      return null;
    }
  }
  static async clearProfile(): Promise<void> {
    try {
      await this.storage.removeValue();
    } catch (error) {
      //console.error("Error clearing Mobile profile:", error);
    }
  }
}
