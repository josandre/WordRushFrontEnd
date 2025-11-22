import { useCallback, useState } from "react";
import { RequestCreator } from "@/app/Request/RequestCreator";

export type AdminUser = {
  id: number;
  nickname: string;
  email: string;
  roleId: number;
  createdOn: string;
  lastActivityDate?: string | null;
  isActive: boolean;
  totalPlayedGame: number;
  wonGames: number;
  totalStore: number;
};

export type UseAdminUsersResult = {
  loading: boolean;
  error?: string;
  users: AdminUser[];
  refresh: () => Promise<void>;
  setSearch: (value: string) => void;
  toggleActive: (id: number) => Promise<void>;
};

const GET_PATH = "/api/admin/users";
const TOGGLE_PATH = (id: number) => `/api/admin/user/${id}/toggle-active`;

export default function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");

  const client = new RequestCreator();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await client.get<AdminUser[]>(`${GET_PATH}${query}`);
    if (!response.success) {
      setError(response.errorMessage || "Failed to load users");
      setUsers([]);
    } else {
      setUsers(response.data || []);
    }
    setLoading(false);
  }, [search]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const toggleActive = useCallback(
    async (id: number) => {
      const response = await client.post<void>(TOGGLE_PATH(id), {});
      if (!response.success) {
        setError(response.errorMessage || "Failed to toggle user state");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
    },
    [client],
  );

  return {
    loading,
    error,
    users,
    refresh,
    setSearch,
    toggleActive,
  };
}
