import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabLabel from "../atoms/TabLabel";
import BadgesSection from "../molecules/BadgesSection";
import StatsSection from "../molecules/StatsSection";
import DetailsSection from "../molecules/DetailsSection";
import { Colors } from "../../theme/color";

const Tab = createMaterialTopTabNavigator();

export default function ProfileTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.bg,
          marginTop: 10,
          marginHorizontal: 10,
          borderRadius: 40,
        },
        tabBarIndicatorStyle: { opacity: 0 },
        swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="Badges"
        component={BadgesSection}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel title="Badge" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsSection}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel title="Stats" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={DetailsSection}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel title="Details" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
