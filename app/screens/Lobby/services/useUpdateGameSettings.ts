import { RequestCreator } from "@/app/Request/RequestCreator";
import { useCallback, useState } from "react";
import { GameSetting } from "./constants";

const path = "/api/game-room/update-settings";

export type GameSettings = {
  RoomId: string;
  Settings: GameSetting;
};

export default function useUpdateGameSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<GameSettings | undefined>(undefined);

  const updateGameSettings = useCallback(async (payload: GameSettings) => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const api = new RequestCreator();
    const result = await api.put<GameSettings>(path, payload);

    if (!result.success) {
      setError(result.errorMessage);
      setLoading(false);
      return { success: false, errorMessage: result.errorMessage };
    }

    setData(result.data);
    setLoading(false);
    return { success: true, data: result.data! };
  }, []);

  return { updateGameSettings, loading, error, data };
}
