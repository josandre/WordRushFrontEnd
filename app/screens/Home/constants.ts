import { GameSetting } from "../Lobby/services/constants";

export type GameRoomData = {
    GameRoomID: string;
    Settings: GameSetting;
};

export type WebSocketRoomCreatedEvent = {
    Type: string;
    JsonData: string;
  };
  
  