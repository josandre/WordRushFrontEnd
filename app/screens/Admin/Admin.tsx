import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Colors } from "@/app/theme/color";
import { isWeb } from "@/app/utils/envDetails";
import useAdminUsers from "./services/useAdminUsers";
import AdminUsersTable from "@/app/components/organisms/admin/AdminUsersTable";
import AdminUsersList from "@/app/components/organisms/admin/AdminUsersList";
import introBg from "@/assets/image/bge.png";

export default function Admin() {
  const {
    loading,
    error,
    users,
    refresh,
    setSearch,
    toggleActive,
    setUserRole,
  } = useAdminUsers();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <ImageBackground source={introBg} resizeMode="cover" style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay} />

        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Admin Panel</Text>

          <View style={styles.searchRow}>
            <TextInput
              placeholder="Search by nickname or email"
              placeholderTextColor={Colors.disable}
              onChangeText={setSearch}
              onSubmitEditing={refresh}
              style={styles.searchInput}
              returnKeyType="search"
            />

            <TouchableOpacity style={styles.searchButton} onPress={refresh}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color={Colors.primary} />}

          {!loading && error && <Text style={styles.errorText}>{error}</Text>}

          {!loading &&
            !error &&
            (isWeb ? (
              <AdminUsersTable
                users={users}
                onToggle={toggleActive}
                onToggleRole={setUserRole}
              />
            ) : (
              <AdminUsersList
                users={users}
                onToggle={toggleActive}
                onToggleRole={setUserRole}
              />
            ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  contentWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 960,
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 12,
  },

  searchRow: {
    flexDirection: "row",
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
    backgroundColor: Colors.bord,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  searchButtonText: {
    color: Colors.primary,
    fontWeight: "600",
  },

  errorText: {
    color: Colors.error,
    marginBottom: 8,
  },
});
