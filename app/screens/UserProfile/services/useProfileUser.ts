import { useCallback, useState } from "react";
import { RequestCreator } from "@/app/Request/RequestCreator";

const GET_PATH = "/api/userProfile/get-profile";
const UPDATE_PATH = "/api/userProfile/update-profile";

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

export type ProfileUserResult = {
  success: boolean;
  data?: ProfileUserResponse;
  errorMessage?: string;
};

export default function useProfileUser() {
  const [pdata, setData] = useState<ProfileUserResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getProfileUser = useCallback(
    async (payload: ProfileUserPayload): Promise<ProfileUserResult> => {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      const api = new RequestCreator();
      const result = await api.get<ProfileUserResponse>(
        `${GET_PATH}?userEmail=${payload.userEmail}`
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
    []
  );

  // Update local state immediately
  const updateProfile = useCallback((updates: Partial<ProfileUserResponse>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update server
  const updateProfileAPI = useCallback(
    async (
      updates: Partial<ProfileUserResponse>
    ): Promise<ProfileUserResult> => {
      if (!pdata?.id)
        return { success: false, errorMessage: "User ID is missing" };

      const api = new RequestCreator();
      const payload: ProfileUserResponse = { ...pdata, ...updates };
      const result = await api.put<ProfileUserResponse>(UPDATE_PATH, payload);

      if (!result.success)
        return { success: false, errorMessage: result.errorMessage };

      setData(result.data);
      return { success: true, data: result.data };
    },
    [pdata]
  );

  return {
    pdata,
    loading,
    error,
    getProfileUser,
    // updateProfile,
    // updateProfileAPI,
  };
}
