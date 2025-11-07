import { ProfileUserResponse } from "../../../screens/UserProfile/services/useProfileUser";
import Storage from "../../Storages/WebStorage";

export default class ProfileWebTokenManager {
  private static storage = new Storage<ProfileUserResponse>("UserProfile");

  static saveProfile = async (UserProfile?: ProfileUserResponse) => {
    if (UserProfile) {
      this.storage.setValue(UserProfile);
    }
  };

  static async getUserProfile() {
    const UserProfile = this.storage.getValue();
    return UserProfile ? UserProfile : null;
  }

  static async clearProfile(): Promise<void> {
    this.storage.removeValue();
  }
}
