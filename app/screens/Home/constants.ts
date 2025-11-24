import { GameSetting } from "../Lobby/services/constants";

export type GameRoomData = {
  GameRoomID: string;
  Settings: GameSetting;
};

export type WebSocketRoomCreatedEvent = {
  Type: string;
  JsonData: string;
};

export type Category = {
  id: number;
  column: string;
};

export type CategoryType = {
  id: number;
  name: string;
  CategoryColumns: Array<Category>;
};
