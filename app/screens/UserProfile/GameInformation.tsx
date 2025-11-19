import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import style from "../../theme/style";
import { Colors } from "../../theme/color";
import Icon from "react-native-vector-icons/Ionicons";
import { AppBar } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import resetPasswordStyles from "../Auth/ResetPassword/ResetPasswordStyles";
import { AppNavigation } from "../../navigator/AppNavigationTypes";
import StatCard from "../../components/molecules/StatCard";
import GameInformationHeader from "../../components/molecules/GameInformationHeader";
import styles from "./GameInformationStyles";
import useGameStatistics from "./services/useGameStatistics";
import useProfileUser from "./services/useProfileUser";
import WordRushSpinner from "../../components/atoms/WordRushSpinner";
import ProfileWebTokenManager from "../../StorageManager/ProfileManager/web/WebProfileManager";
import ProfileMobileTokenManager from "../../StorageManager/ProfileManager/mobile/MobileProfileManager";

const isWeb = Platform.OS === "web";

export default function GameInformation(): React.JSX.Element {
  const navigation = useNavigation<AppNavigation>();
  const { getGameStatistics, loading, data: statisticsData } =
    useGameStatistics();
  const { getProfileUser, pdata } = useProfileUser();

  // Load profile and statistics when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const manager = isWeb
          ? ProfileWebTokenManager
          : ProfileMobileTokenManager;
        const userdata = await manager.getUserProfile();

        if (userdata?.email) {
          await getProfileUser({ userEmail: userdata.email });
        }

        if (userdata?.id) {
          await getGameStatistics({ userId: userdata.id });
        }
      };

      loadData();
    }, [getProfileUser, getGameStatistics]),
  );

  // Get statistics from API or use defaults
  const totalPlayedGames = statisticsData?.totalPlayedGame ?? 0;
  const wonGames = statisticsData?.wonGames ?? 0;
  const totalScore = statisticsData?.totalStore ?? 0;
  const winRate =
    totalPlayedGames > 0 ? Math.round((wonGames / totalPlayedGames) * 100) : 0;

  return (
    <SafeAreaView style={[style.area, resetPasswordStyles.container]}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <KeyboardAvoidingView
        style={resetPasswordStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[style.main, resetPasswordStyles.main]}>
          <AppBar
            title="Game Information"
            titleStyle={[style.apptitle, resetPasswordStyles.appTitle]}
            centerTitle={true}
            style={resetPasswordStyles.appBar}
            elevation={0}
            leading={
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={resetPasswordStyles.backButton}
              >
                <Icon name="arrow-back" size={24} color={Colors.active} />
              </TouchableOpacity>
            }
          />

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <WordRushSpinner text="Loading..." textColor="#000" size={100} />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <GameInformationHeader />

              <View style={styles.statsContainer}>
                <StatCard
                  icon="game-controller"
                  iconColor={Colors.primary}
                  title="Total Played Games"
                  value={totalPlayedGames}
                  subtitle="Games completed"
                  gradientColor={Colors.primary}
                />

                <StatCard
                  icon="trophy"
                  iconColor="#FFC107"
                  title="Won Games"
                  value={wonGames}
                  subtitle={`${winRate}% win rate`}
                  gradientColor="#FFC107"
                />

                <StatCard
                  icon="star"
                  iconColor="#FF6B6B"
                  title="Total Score"
                  value={`${totalScore.toLocaleString()} pts`}
                  subtitle="All-time points"
                  gradientColor="#FF6B6B"
                />
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

