import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { isSignedIn,isLoaded } = useAuth();

  console.log({isSignedIn})

  if(isSignedIn === undefined){
    return <View>
      <ActivityIndicator size={"large"} color={"#FF5708"}/>
    </View>
  }


  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signIn"} />;
  }

  return (
    <>
      <Stack screenOptions={{headerShown:false}}/>
    </>
  );
}
