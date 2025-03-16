import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import HomeScreen from ".";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@clerk/clerk-expo";

type Props = {};

const TabLayout = (props: Props) => {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerRight: () => (
          <Feather
            name="log-out"
            size={22}
            color={"black"}
            style={{
              paddingRight: 10
            }}
            onPress={() => signOut()}
          />
        )
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

      <Tabs.Screen
        name="communities"
        options={{
          title: "Communities",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={24} color={color} />
          ),
          headerShown: false,
          tabBarStyle: {
            display: "none"
          }
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => (
            <Feather name="bell" size={24} color={color} />
          )
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
