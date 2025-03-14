import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import HomeScreen from ".";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {};

const TabLayout = (props: Props) => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black"
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Reddit",
          headerTintColor: "#FF5708",
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          )
        }}
      />

      
    </Tabs>
  );
};

export default TabLayout;
