import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens"
import { Tokens } from "../constants"
import Storage from "./MobileToken"


export default class MobileTokenManager {
    private static storage = new Storage<Tokens>('tokens')


    static saveTokens = async(tokens?: Tokens ) => {
        if(tokens){
            await this.storage.setValue(tokens)
        }
       
    }

    static async getAccessToken() {
        const tokens = await this.storage.getValue()
        return tokens?.accessToken
    }

    static async clearTokens(): Promise<void> {
    try {
      await this.storage.removeValue();      
    } catch (e) {      
    }
  }
}
