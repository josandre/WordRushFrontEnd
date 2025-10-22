import { RequestCreator } from "@/app/Request/RequestCreator";
import { useCallback, useState } from "react";

const path = "/auth/login";

export type LogInPayload = {
  email: string;
  password: string;
};

export type LogInResponse = {
  accessToken: string;
};

export default function useLogIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<LogInResponse | undefined>(undefined);

  const logIn = useCallback(async (payload: LogInPayload) => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const api = new RequestCreator();
    const result = await api.post<LogInResponse>(path, payload);

    if (!result.success) {
      setError(result.errorMessage);
      setLoading(false);
      return { success: false, errorMessage: result.errorMessage };
    }

    setData(result.data);
    setLoading(false);
    return { success: true, data: result.data! };
  }, []);

  return { logIn, loading, error, data };
}
