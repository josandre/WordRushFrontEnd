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
  setUserRole: (
    userId: number,
    newRoleId: number,
  ) => Promise<{
    success: boolean;
    error?: unknown;
  }>;
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

  /**
   * NEW: Cambiar rol de usuario (1 = normal, 2 = admin)
   */
  const setUserRole = useCallback(
    async (userId: number, newRoleId: number) => {
      try {
        const response = await client.post(
          `/api/admin/user/${userId}/set-role?roleId=${newRoleId}`,
          {},
        );

        if (!response.success) {
          return { success: false, error: response.errorMessage };
        }

        // Actualiza el estado local como toggleActive
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, roleId: newRoleId } : u)),
        );

        return { success: true };
      } catch (err) {
        console.error("Error changing role:", err);
        return { success: false, error: err };
      }
    },
    [client],
  );

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
    setUserRole,
  };
}
