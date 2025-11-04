import { Tokens } from "../constants";
import Storage from "../../Storages/WebStorage";

export default class WebTokenManager {
  private static storage = new Storage<Tokens>("tokens");

  static saveTokens = async (tokens?: Tokens) => {
    if (tokens) {
      this.storage.setValue(tokens);
    }
  };

  static async getAccessToken() {
    const tokens = await this.storage.getValue();
    return tokens?.accessToken;
  }
}
