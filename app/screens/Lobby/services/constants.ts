export type GameSetting = {
  Letters: string[] | null;
  Categories: string[] | null;
  TimeLimit: number;
  Order: GameOrder;
  /**
   * Number of hint tokens each player will have in a game session.
   * Players consume one token per hint requested. Defaults to 3.
   */
  HintTokens?: number;
};

export enum GameOrder {
  Ascending = "Ascending",
  Descending = "Descending",
}

export enum LetterOrder {
  Ascending = "ascending",
  Descending = "descending",
}

export const letterOrderToGameOrder = (order: LetterOrder): GameOrder => {
  return order === LetterOrder.Ascending
    ? GameOrder.Ascending
    : GameOrder.Descending;
};

export const gameOrderToLetterOrder = (
  order: GameOrder | number,
): LetterOrder => {
  if (typeof order === "number") {
    return order === 1 ? LetterOrder.Descending : LetterOrder.Ascending;
  }
  return order === GameOrder.Descending
    ? LetterOrder.Descending
    : LetterOrder.Ascending;
};
