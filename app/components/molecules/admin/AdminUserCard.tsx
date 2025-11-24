import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/app/theme/color";
import { AdminUser } from "@/app/screens/Admin/services/useAdminUsers";
import AdminSwitch from "@/app/components/atoms/admin/AdminSwitch";
import AdminMetaText from "@/app/components/atoms/admin/AdminMetaText";

type Props = {
  user: AdminUser;
  onToggle: (id: number) => void; // ACTIVE toggle
  onToggleRole: (id: number, newRoleId: number) => void; // rol admin
};

export default function AdminUserCard({ user, onToggle, onToggleRole }: Props) {
  return (
    <View style={styles.card}>
      {/** HEADER: Nombre, Email + Toggle Activo */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nickname} numberOfLines={1}>
            {user.nickname}
          </Text>
          <AdminMetaText>{user.email}</AdminMetaText>
        </View>

        <View style={styles.switchContainer}>
          <AdminMetaText>{user.isActive ? "Activo" : "Inactivo"}</AdminMetaText>

          <AdminSwitch
            value={user.isActive}
            onToggle={() => onToggle(user.id)}
          />
        </View>
      </View>

      {/** ADMIN ROLE SWITCH BELOW ACTIVE SWITCH — opción B */}
      <View style={{ marginTop: 8, alignItems: "flex-end" }}>
        <AdminMetaText>{user.roleId === 2 ? "Admin" : "Usuario"}</AdminMetaText>

        <AdminSwitch
          value={user.roleId === 2}
          onToggle={() => {
            const newRole = user.roleId === 2 ? 1 : 2;
            onToggleRole(user.id, newRole);
          }}
        />
      </View>

      <AdminMetaText>ID: {user.id}</AdminMetaText>
      <AdminMetaText>Rol: {user.roleId}</AdminMetaText>

      <AdminMetaText>
        Creado: {new Date(user.createdOn).toLocaleDateString()}
      </AdminMetaText>

      <View style={styles.statsRow}>
        <AdminMetaText>Jugados: {user.totalPlayedGame}</AdminMetaText>
        <AdminMetaText>Ganados: {user.wonGames}</AdminMetaText>
        <AdminMetaText>Score: {user.totalStore}</AdminMetaText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bord,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  nickname: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.txt,
    marginBottom: 2,
  },
  switchContainer: { alignItems: "flex-end" },
  statsRow: { marginTop: 6 },
});
