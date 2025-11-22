import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import useAdminUsers, { AdminUser } from "./services/useAdminUsers";
import { Colors } from "@/app/theme/color";

function Header() {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
      <Text style={[styles.headerCell, styles.cellLarge]}>Nickname</Text>
      <Text style={[styles.headerCell, styles.cellLarge]}>Email</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Role</Text>
      <Text style={[styles.headerCell, styles.cellMedium]}>Created</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Played</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Wins</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Score</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Active</Text>
      <Text style={[styles.headerCell, styles.cellSmall]}>Toggle</Text>
    </View>
  );
}

function Row({
  user,
  onToggle,
}: {
  user: AdminUser;
  onToggle: (id: number) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellId]}>{user.id}</Text>
      <Text style={[styles.cell, styles.cellLarge]} numberOfLines={1}>
        {user.nickname}
      </Text>
      <Text style={[styles.cell, styles.cellLarge]} numberOfLines={1}>
        {user.email}
      </Text>
      <Text style={[styles.cell, styles.cellSmall]}>{user.roleId}</Text>
      <Text style={[styles.cell, styles.cellMedium]}>
        {new Date(user.createdOn).toLocaleDateString()}
      </Text>
      <Text style={[styles.cell, styles.cellSmall]}>
        {user.totalPlayedGame}
      </Text>
      <Text style={[styles.cell, styles.cellSmall]}>{user.wonGames}</Text>
      <Text style={[styles.cell, styles.cellSmall]}>{user.totalStore}</Text>
      <View style={[styles.cell, styles.cellSmall, styles.switchCell]}>
        <Switch value={user.isActive} onValueChange={() => onToggle(user.id)} />
      </View>
      <View style={[styles.cell, styles.cellSmall]}>
        <TouchableOpacity onPress={() => onToggle(user.id)}>
          <Text style={styles.toggleText}>Toggle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Admin() {
  const { loading, error, users, refresh, setSearch, toggleActive } =
    useAdminUsers();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <Text style={styles.subtitle}>
        Manage users, activation status and basic game statistics.
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by nickname or email"
          placeholderTextColor={Colors.disable}
          onChangeText={setSearch}
          onSubmitEditing={refresh}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={refresh}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {error && !loading && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<Header />}
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <Row user={item} onToggle={toggleActive} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.active,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.txt1,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.bg1,
    borderColor: Colors.bord,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    color: Colors.txt,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  searchButtonText: {
    color: Colors.secondary,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: Colors.bg1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bord,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.txt,
  },
  row: {
    flexDirection: "row",
    backgroundColor: Colors.bg,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bord,
  },
  cell: {
    fontSize: 12,
    color: Colors.txt,
    paddingRight: 4,
  },
  cellId: {
    width: 40,
  },
  cellSmall: {
    width: 60,
  },
  cellMedium: {
    width: 90,
  },
  cellLarge: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  switchCell: {
    justifyContent: "center",
  },
  toggleText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    marginBottom: 8,
  },
});
