import Storage from "../../Storages/MobileStorage";
import { GameRoomData } from "@/app/screens/Home/constants";

export default class MobileGameManager {
  private static storage = new Storage<GameRoomData>("GameRoomData");

  static saveGameRoomData = async (gameRoomData?: GameRoomData) => {
    if (gameRoomData) {
      await this.storage.setValue(gameRoomData);
    }
  };

  static async getGameRoomData() {
    const gameRoomData = await this.storage.getValue();
    return gameRoomData;
  }
}
