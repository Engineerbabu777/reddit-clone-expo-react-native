import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AAppLayout() {
  const { isSignedIn } = useAuth();

  console.log({isSignedIn})


  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signUp"} />;
  }

  return (
    <>
      <Stack />
    </>
  );
}
