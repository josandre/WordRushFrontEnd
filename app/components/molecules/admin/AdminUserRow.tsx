import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";
import { AdminUser } from "@/app/screens/Admin/services/useAdminUsers";
import AdminSwitch from "@/app/components/atoms/admin/AdminSwitch";

type Props = {
  user: AdminUser;
  onToggle: (id: number) => void;
  onToggleRole: (userId: number, newRoleId: number) => void;
};

export default function AdminUserRow({ user, onToggle, onToggleRole }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellId]}>{user.id}</Text>

      <Text style={[styles.cell, styles.cellLarge]} numberOfLines={1}>
        {user.nickname}
      </Text>

      <Text style={[styles.cell, styles.cellLarge]} numberOfLines={1}>
        {user.email}
      </Text>

      {/* ROLE SWITCH (normal=1 / admin=2) */}
      <View style={[styles.cell, styles.roleCell]}>
        <AdminSwitch
          value={user.roleId === 2}
          onToggle={() => {
            const newRole = user.roleId === 2 ? 1 : 2;
            onToggleRole(user.id, newRole);
          }}
        />
      </View>

      <Text style={[styles.cell, styles.cellMedium]}>
        {new Date(user.createdOn).toLocaleDateString()}
      </Text>

      <Text style={[styles.cell, styles.cellSmall]}>
        {user.totalPlayedGame}
      </Text>
      <Text style={[styles.cell, styles.cellSmall]}>{user.wonGames}</Text>
      <Text style={[styles.cell, styles.cellSmall]}>{user.totalStore}</Text>

      <View style={[styles.cell, styles.switchCell]}>
        <AdminSwitch value={user.isActive} onToggle={() => onToggle(user.id)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: Colors.bg,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bord,
    alignItems: "center",
  },
  cell: { paddingHorizontal: 4 },
  cellId: { width: 40 },
  cellSmall: { width: 60 },
  cellMedium: { width: 90 },
  cellLarge: { flex: 1 },
  switchCell: { justifyContent: "center", alignItems: "center", width: 80 },
  roleCell: { justifyContent: "center", alignItems: "center", width: 80 },
});
