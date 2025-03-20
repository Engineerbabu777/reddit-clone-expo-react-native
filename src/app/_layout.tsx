import { tokenCache } from "../../cahe";
import {
  ClerkProvider,
  ClerkLoaded,
  useAuth,
  ClerkLoading,
} from "@clerk/clerk-expo";
import { Slot, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  useReactQueryDevTools(queryClient);

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoading>
          <Screen />
        </ClerkLoading>

        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

function Screen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ClerkLoading>
        <ActivityIndicator size={"large"} color={"#FF5708"} />
      </ClerkLoading>
    </View>
  );
}
