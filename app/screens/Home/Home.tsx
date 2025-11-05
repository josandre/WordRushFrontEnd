import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import style from "@/app/theme/style";
import { Colors } from "@/app/theme/color";
import { isWeb } from "@/app/utils/envDetails";
import ProfileMobileTokenManager from "@/app/StorageManager/ProfileManager/mobile/MobileProfileManager";
import ProfileWebTokenManager from "@/app/StorageManager/ProfileManager/web/WebProfileManager";
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
import { GameRoomData, WebSocketRoomCreatedEvent, Category } from "./constants";
import GameManager from "@/app/StorageManager/GameManager/GameManager";
import { Snackbar } from "@react-native-material/core";
import { SnackBarProps, FALLBACK_ERROR_MESSAGE } from "@/app/screens/Auth/constants";
import { ERROR_SNACKBAR_COLOR } from "@/app/screens/Auth/styles";

export default function Home() {
  const navigation = useNavigation<AppNavigation>();
  const [loading, setLoading] = useState(true);
  const { getProfileUser, pdata } = useProfileUser();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackBarProps>({
    visible: false,
    message: "",
  });

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

    if (!isWeb) await new Promise((r) => setTimeout(r, 200));

    const stored = await manager.getUserProfile();
  

    if (stored?.email) {
      const result = await getProfileUser({ userEmail: stored.email });
      if (result.success) 
        await saveProfile(result.data);
    } else {
      console.warn("No stored profile found on device.");
    }

    setLoading(false);
  }, [getProfileUser]);

  function createRoom() {
    setCreatingRoom(true);
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

  async function onRoomCreated(data: WebSocketRoomCreatedEvent) {
    const jsonData = JSON.parse(data.JsonData) as GameRoomData;
  
    const roomData: GameRoomData = {
      GameRoomID: jsonData.GameRoomID,
      Settings: jsonData.Settings,
      CategoryType: jsonData.CategoryType
    };
    
    const gameManager = new GameManager();

    await gameManager.saveGameRoomData(roomData).then(() => { 
      setCreatingRoom(false);
      navigation.navigate("Lobby", {
        isOwner: true,
        roomId: jsonData.GameRoomID,
        roomData: roomData,
      });
    }).catch((error) => {
      setCreatingRoom(false);
      const errorSnackBar: SnackBarProps = {
        visible: true,
        message: "Error saving game room data. Please try again.",
        color: ERROR_SNACKBAR_COLOR,
      };
      setSnackbar(errorSnackBar);
    });
  }

  function joinRoom() {
    navigation.navigate("JoinLobby")
  }


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
      {snackbar.visible && (
        <Snackbar
          message={snackbar.message ?? FALLBACK_ERROR_MESSAGE}
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
            backgroundColor: snackbar.color,
          }}
        />
      )}
    </SafeAreaView>
  );
}
