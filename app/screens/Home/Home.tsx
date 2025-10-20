import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, ActivityIndicator } from "react-native";

import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";

import { isWeb } from "@/app/utils/envDetails";
import ProfileMobileTokenManager from "@/app/TokenManagers/mobile/ProfileMobileTokenManager";
import ProfileWebTokenManager from "@/app/TokenManagers/web/ProfileWebTokenManager";

import WelcomeTitleBar from "@/app/components/molecules/WelcomeTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import DescriptionButton from "@/app/components/atoms/DescriptionButton";

import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { useNavigation } from "@react-navigation/native";

import hostGameIcon from "@/assets/image/s43.png";
import joinGameIcon from "@/assets/image/s39.png";

import avatars, { getAvatarImage } from "@/assets/avatars";
import useProfileUser from "@/app/screens/UserProfile/services/useProfileUser";

export default function Home() {
  const navigation = useNavigation<AppNavigation>();

  const [loading, setLoading] = useState(true);
  const { getProfileUser, pdata } = useProfileUser();

  function hostGame(): void {
    // TODO: Actually create a lobby for other players to join
    navigation.navigate("Lobby");
  }

  function joinGame(): void {
    navigation.navigate("JoinLobby");
  }

  async function retrieveProfile() {
    setLoading(true);
    const manager = isWeb
      ? ProfileWebTokenManager
      : ProfileMobileTokenManager;
    const userdata = await manager.getUserProfile();
    userdata?.nickname;

    if (userdata?.email) {
      await getProfileUser({ userEmail: userdata.email });
    }
    setLoading(false);
  }

  // THIS IS JUST FOR TESTING AUTH INTERCEPTOR< IT SHOULD BE REMOVED
  useEffect(() => {
    if (loading) {
      retrieveProfile();
    }
  });

  const avatarSource = getAvatarImage(pdata?.avatar) || avatars["default"];

  if (loading) {
      return (
      <SafeAreaView 
        style={[style.area, { backgroundColor: Colors.primary }]}
      >
        <View style={{ marginTop: 80 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <ContentCard
              title="Loading..."
              content={
                <View>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              }
            ></ContentCard>
          </ScrollView>
        </View>
      </SafeAreaView>
      );
  } else {
    return (
      <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>

        <View style={{ marginTop: 40 }}>
          <WelcomeTitleBar username={pdata?.nickname} avatar={avatarSource}></WelcomeTitleBar>

          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <ContentCard
              title="Game"
              content={
                <View>
                  <DescriptionButton
                    title="Host Game"
                    description="Create a Lobby to play with your friends"
                    icon={hostGameIcon}
                    onPress={hostGame}
                  ></DescriptionButton>

                  <DescriptionButton
                    title="Join Game"
                    description="Join into an existing Lobby to play with your friends"
                    icon={joinGameIcon}
                    onPress={joinGame}
                  ></DescriptionButton>
                </View>
              }
            ></ContentCard>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
