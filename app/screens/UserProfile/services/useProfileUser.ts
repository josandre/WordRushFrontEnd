import { useCallback, useState } from "react";
import { RequestCreator } from "@/app/Request/RequestCreator";

const path = "/api/userProfile/get-profile";

export type ProfileUserPayload = {
  userEmail: string;
};

export type ProfileUserResponse = {
  id?: number;
  roleId?: number;
  nickname?: string;
  email?: string;
  avatar?: string;
  password?: string;
};

export type ProfileUserSuccess = {
  success: true;
  data: ProfileUserResponse;
};

export type ProfileUserFailure = {
  success: false;
  errorMessage: string;
  status?: number;
  details?: unknown;
};

export type ProfileUserResult = ProfileUserSuccess | ProfileUserFailure;

export default function useProfileUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<ProfileUserResponse | undefined>(undefined);

  const getProfileUser = useCallback(async (payload: ProfileUserPayload) => {
    setLoading(true);
    setError(undefined);
    setData(undefined);

    const api = new RequestCreator();
    const result = await api.get<ProfileUserResponse>(
      path + `?userEmail=${payload.userEmail}`,
    );

    if (!result.success) {
      setError(result.errorMessage);
      setLoading(false);
      return { success: false, errorMessage: result.errorMessage };
    }

    setData(result.data);
    setLoading(false);
    return { success: true, data: result.data! };
  }, []);

  return {
    getProfileUser,
    loading,
    error,
    data,
  };
}
