import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import Storage from "./WebToken"

export default class ProfileWebTokenManager {
    
    private static storage = new Storage<ProfileUserResponse>('profile')


    static saveProfile = async(UserProfile?: ProfileUserResponse) => {

        if(UserProfile){
            this.storage.setValue(UserProfile)
        }        
    }

    static async getUserProfile() {
        const profile = await this.storage.getValue()
        return profile? profile : null
    }

    static async clearProfile(): Promise<void> {
        await this.storage.removeValue();        
    }
}