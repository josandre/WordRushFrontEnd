import { RequestCreator } from "@/app/Request/RequestCreator";
import { useCallback, useState } from "react";

const GET_PATH = "/api/gamestatistics";

export type GameStatisticsPayload = {
  userId: number;
};

export type GameStatisticsResponse = {
  userId?: number;
  totalPlayedGame?: number;
  wonGames?: number;
  totalStore?: number;
};

export type GameStatisticsResult = {
  success: boolean;
  data?: GameStatisticsResponse;
  errorMessage?: string;
};

export default function useGameStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<GameStatisticsResponse | undefined>(
    undefined,
  );

  const getGameStatistics = useCallback(
    async (payload: GameStatisticsPayload): Promise<GameStatisticsResult> => {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      const api = new RequestCreator();
      const result = await api.get<GameStatisticsResponse>(
        `${GET_PATH}/${payload.userId}`,
      );

      if (!result.success) {
        setError(result.errorMessage);
        setLoading(false);
        return { success: false, errorMessage: result.errorMessage };
      }

      setData(result.data);
      setLoading(false);
      return { success: true, data: result.data };
    },
    [],
  );

  return { getGameStatistics, loading, error, data };
}

