export type GameSetting = {
    Letters: string[];
    TimeLimit: number;
    Order: GameOrder;
}

export enum GameOrder {
    Ascending = "Ascending",
    Descending = "Descending",
}

export enum LetterOrder {
    Ascending = "ascending",
    Descending = "descending",
}

export const letterOrderToGameOrder = (order: LetterOrder): GameOrder => {
    return order === LetterOrder.Ascending ? GameOrder.Ascending : GameOrder.Descending;
}

export const gameOrderToLetterOrder = (order: GameOrder | number): LetterOrder => {
    if (typeof order === 'number') {
        return order === 1 ? LetterOrder.Descending : LetterOrder.Ascending;
    }
    return order === GameOrder.Descending ? LetterOrder.Descending : LetterOrder.Ascending;
}