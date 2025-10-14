import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import Storage from "./MobileToken";

export default class ProfileMobileTokenManager {
  private static storage = new Storage<ProfileUserResponse>("UserProfile");

  // static saveProfile = async (UserProfile?: ProfileUserResponse) => {
  //   if (UserProfile) {
  //     await this.storage.setValue(UserProfile);
  //   }
  // };
  static async saveProfile(userProfile?: ProfileUserResponse): Promise<void> {
    try {
      if (userProfile) {
        await this.storage.setValue(userProfile);
      } else {
        console.warn("saveProfile called with undefined profile");
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  }
  // static async getUserProfile() {
  //   try {
  //     const userProfile = await this.storage.getValue();
  //     return userProfile ?? null;
  //   } catch (e) {
  //     console.error("Error getting profile:", e);
  //     return null;
  //   }
  // }
  static async getUserProfile(): Promise<ProfileUserResponse | null> {
    try {
      const userProfile = await this.storage.getValue();
      return userProfile ?? null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }
  static async clearProfile(): Promise<void> {
    try {
      await this.storage.removeValue();
    } catch (error) {
      console.error("Error clearing user profile:", error);
    }
  }
}
