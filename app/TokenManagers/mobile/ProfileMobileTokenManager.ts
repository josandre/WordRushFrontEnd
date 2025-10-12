import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import Storage from "./MobileToken"


export default class ProfileMobileTokenManager {
    private static storage = new Storage<ProfileUserResponse>('profile')


    static saveProfile = async(UserProfile?: ProfileUserResponse ) => {
        if(UserProfile){
            await this.storage.setValue(UserProfile)
        }
       
    }

    static async getUserProfile() {
        const profile = await this.storage.getValue()
        return profile? profile : null
    }
    
    static async clearProfile(): Promise<void> {
    try {
      await this.storage.removeValue();      
    } catch (e) {      
    }
  }
}