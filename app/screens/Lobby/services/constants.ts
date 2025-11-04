export type GameSetting = {
    Letters: string[];
    TimeLimit: number;
    Order: GameOrder;
}

export enum GameOrder {
    Ascending = "Ascending",
    Descending = "Descending",
}