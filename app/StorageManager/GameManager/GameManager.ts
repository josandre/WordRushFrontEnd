import { GameRoomData } from "@/app/screens/Home/constants";
import Manager from "../Manager";
import MobileGameManager from "./web/MobileGameManager";
import WebGameManager from "./web/MobileGameManager";

export default class GameManager extends Manager {
  constructor() {
    super();
  }

  saveGameRoomData = async (gameRoomData: GameRoomData) => {
    if (this.isWebPlatform()) {
      await WebGameManager.saveGameRoomData(gameRoomData);
    } else {
      await MobileGameManager.saveGameRoomData(gameRoomData);
    }
  };

  getGameRoomData = async () => {
    if (this.isWebPlatform()) {
      return await WebGameManager.getGameRoomData();
    } else {
      return await MobileGameManager.getGameRoomData();
    }
  };

  clearGameRoomData = async () => {
    if (this.isWebPlatform()) {
      await WebGameManager.clearGameRoomData();
    } else {
      await MobileGameManager.clearGameRoomData();
    }
  };
}
