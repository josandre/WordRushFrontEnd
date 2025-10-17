import { useCallback, useState } from "react";
import { RequestCreator } from "@/app/Request/RequestCreator";
import { Failure, Success } from "../../services/constants";

const path = "/auth/reset-password";

export type ResetPasswordPayload = {
  email: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  Success: boolean;
  Message: string;
};

export type ResetPasswordResult = Success | Failure;

export default function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<ResetPasswordResponse | undefined>(
    undefined
  );

  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const api = new RequestCreator();
    const result = await api.put<ResetPasswordResponse>(path, payload);

    if (!result.success) {
      setError(result.errorMessage);
      setLoading(false);
      return { success: false, errorMessage: result.errorMessage };
    }

    setData(result.data);
    setLoading(false);
    return { success: true, data: result.data! };
  }, []);

  return { resetPassword, loading, error, data };
}
