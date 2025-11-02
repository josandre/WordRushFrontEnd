import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";

import { isWeb } from "@/app/utils/envDetails";
import ProfileMobileTokenManager from "@/app/TokenManagers/mobile/ProfileMobileTokenManager";
import ProfileWebTokenManager from "@/app/TokenManagers/web/ProfileWebTokenManager";

import WelcomeTitleBar from "@/app/components/molecules/WelcomeTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import DescriptionButton from "@/app/components/atoms/DescriptionButton";

import { AppNavigation } from "@/app/navigator/AppNavigationTypes";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import hostGameIcon from "@/assets/image/s43.png";
import joinGameIcon from "@/assets/image/s39.png";
import { ProfileUserResponse } from "../../screens/UserProfile/services/useProfileUser";
import avatars, { getAvatarImage } from "@/assets/avatars";
import useProfileUser from "@/app/screens/UserProfile/services/useProfileUser";

import webSocketService from "@/app/services/webSocketService";

export default function Home() {
  const navigation = useNavigation<AppNavigation>();
  const [loading, setLoading] = useState(true);
  const { getProfileUser, pdata } = useProfileUser();

  const manager = isWeb ? ProfileWebTokenManager : ProfileMobileTokenManager;

  async function saveProfile(profileData: ProfileUserResponse | undefined) {
    if (isWeb) {
      await ProfileWebTokenManager.clearProfile();
      await ProfileWebTokenManager.saveProfile(profileData);
    } else {
      await ProfileMobileTokenManager.clearProfile();
      await ProfileMobileTokenManager.saveProfile(profileData);
    }
  }

  const retrieveProfile = useCallback(async () => {
    setLoading(true);

    // Small delay only for mobile
    if (!isWeb) await new Promise((r) => setTimeout(r, 200));

    const stored = await manager.getUserProfile();
    console.log("Retrieved stored profile:", stored);

    if (stored?.email) {
      // Refresh from API and update local cache
      const result = await getProfileUser({ userEmail: stored.email });
      if (result.success) 
        await saveProfile(result.data);
    } else {
      console.warn("No stored profile found on device.");
    }

    setLoading(false);
  }, [getProfileUser]);

  // Called when pressing the Create Room button, it simply tells the server to generate a new room
  function createRoom() {
    //console.log("Vamos a crear el room");
    const jsonData = {
      PlayerProfile: {
        Nickname: pdata?.nickname,
        Avatar: pdata?.avatar,
        Email: pdata?.email 
        }
    };

    webSocketService.sendMessage({
      Type: "GAME_ROOM|CREATE",
      JsonData: JSON.stringify(jsonData)
    });
  }

  // Called when the Room creation has been confirmed from the server
  function onRoomCreated(data: any) {
    var jsonData = JSON.parse(data.JsonData);

    // The player is automatically added to the room when it is created
    // So, just redirect to the screen and request the info later
    navigation.navigate("Lobby", {
      isOwner: true,
      roomId: jsonData.GameRoomID,
    });
  }

  // Called when pressing the Join Room button
  function joinRoom() {
    navigation.navigate("JoinLobby")
  }

  // Run on focus (so updated profiles are reflected when user returns)
  useFocusEffect(
    useCallback(() => {
      retrieveProfile();

      webSocketService.connect();
      webSocketService.addCallbacks("GAME_ROOM|CREATED", onRoomCreated);

      return () => {
        webSocketService.removeCallbacks("GAME_ROOM|CREATED", onRoomCreated);
      };
    }, [retrieveProfile])
  );

  const avatarSource = getAvatarImage(pdata?.avatar) || avatars["default"];

  if (loading) {
    return (
      <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
        <View style={{ marginTop: 80 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ContentCard
              title="Loading..."
              content={
                <View>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              }
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[style.area, { backgroundColor: Colors.primary }]}>
      <View style={{ marginTop: 40 }}>
        <WelcomeTitleBar username={pdata?.nickname} avatar={avatarSource} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ContentCard
            title="Game"
            content={
              <View>
                <DescriptionButton
                  title="Host Game"
                  description="Create a Lobby to play with your friends"
                  icon={hostGameIcon}
                  onPress={createRoom}
                />
                <DescriptionButton
                  title="Join Game"
                  description="Join into an existing Lobby to play with your friends"
                  icon={joinGameIcon}
                  onPress={joinRoom}
                />
              </View>
            }
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
