import React from "react";
import { View, ScrollView, ImageSourcePropType } from "react-native";

import WelcomeTitleBar from "@/app/components/molecules/WelcomeTitleBar";
import ContentCard from "@/app/components/atoms/ContentCard";
import DescriptionButton from "@/app/components/atoms/DescriptionButton";

import hostGameIcon from "@/assets/image/s43.png";
import joinGameIcon from "@/assets/image/s39.png";

interface HomeScreenViewProperties {
  username: string;
  avatar?: ImageSourcePropType;
  onHostGamePress?: () => void;
  onJoinGamePress?: () => void;
}

// Main content displayed in the Home Screen
export default function HomeScreenView({
  username,
  avatar,
  onHostGamePress,
  onJoinGamePress,
}: HomeScreenViewProperties) {
  return (
    <View>
      <WelcomeTitleBar username={username} avatar={avatar}></WelcomeTitleBar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <ContentCard
          title="Game"
          content={
            <View>
              <DescriptionButton
                title="Host Game"
                description="Create a Lobby to play with your friends"
                icon={hostGameIcon}
                onPress={onHostGamePress}
              ></DescriptionButton>

              <DescriptionButton
                title="Join Game"
                description="Join into an existing Lobby to play with your friends"
                icon={joinGameIcon}
                onPress={onJoinGamePress}
              ></DescriptionButton>
            </View>
          }
        ></ContentCard>
      </ScrollView>
    </View>
  );
}
