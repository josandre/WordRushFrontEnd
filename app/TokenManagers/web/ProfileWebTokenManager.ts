import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import Storage from "./WebToken";

export default class ProfileWebTokenManager {
  private static storage = new Storage<ProfileUserResponse>("UserProfile");

  static saveProfile = async (UserProfile?: ProfileUserResponse) => {
    if (UserProfile) {
      this.storage.setValue(UserProfile);
    }
  };

  static async getUserProfile() {
    try {
      const UserProfile = this.storage.getValue();
      return UserProfile ? UserProfile : null;
    } catch (error) {
      return null;
    }
  }

  static async clearProfile(): Promise<void> {
    try {
      this.storage.removeValue();
    } catch (error) {
      //console.error("Error clearing Web profile:", error);
    }
  }
}
