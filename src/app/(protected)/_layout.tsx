import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signIn"} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="post/[id]"
          options={{
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#FF5700"
            },
            animation: "slide_from_bottom",
            headerLeft: () => (
              <>
                <AntDesign
                  name="close"
                  size={24}
                  color={"white"}
                  onPress={() => router.back()}
                />
              </>
            ),
            headerRight: () => (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10
                  }}
                >
                  <AntDesign name="search1" size={24} color={"white"} />
                  <MaterialIcons name="sort" size={24} color={"white"} />
                  <Entypo
                    name="dots-three-horizontal"
                    size={24}
                    color={"white"}
                  />
                </View>
              </>
            )
          }}
        />
        <Stack.Screen name="groupSelector" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
