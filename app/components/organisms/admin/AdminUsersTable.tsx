import React from "react";
import { FlatList, StyleSheet } from "react-native";
import AdminUserRow from "@/app/components/molecules/admin/AdminUserRow";
import AdminTableHeader from "@/app/components/molecules/admin/AdminTableHeader";
import { AdminUser } from "@/app/screens/Admin/services/useAdminUsers";

type Props = {
  users: AdminUser[];
  onToggle: (id: number) => void;
  onToggleRole: (id: number, newRoleId: number) => void;
};

export default function AdminUsersTable({
  users,
  onToggle,
  onToggleRole,
}: Props) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={<AdminTableHeader />}
      stickyHeaderIndices={[0]}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <AdminUserRow
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
