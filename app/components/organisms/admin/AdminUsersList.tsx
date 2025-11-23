import React from "react";
import { FlatList, StyleSheet } from "react-native";
import AdminUserCard from "@/app/components/molecules/admin/AdminUserCard";
import { AdminUser } from "@/app/screens/Admin/services/useAdminUsers";

type Props = {
  users: AdminUser[];
  onToggle: (id: number) => void; // toggle activo
  onToggleRole: (id: number, newRoleId: number) => void; // toggle admin
};

export default function AdminUsersList({
  users,
  onToggle,
  onToggleRole,
}: Props) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <AdminUserCard
          user={item}
          onToggle={onToggle}
          onToggleRole={onToggleRole}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
  },
});
