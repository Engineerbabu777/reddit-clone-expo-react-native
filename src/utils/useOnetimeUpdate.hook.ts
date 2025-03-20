import { useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";
import { useSupabaseWithoutHeader } from "../lib/supabse";

const useUserCreationInSupabase = () => {
  const { user } = useUser(); // Hook inside hook ✅
  const supabase = useSupabaseWithoutHeader();

  const performOperation = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem("@save-user-clerk-in-supabase");

      if (value !== null) {
        const { data, error } = await supabase.from("users").insert({
          email: user?.emailAddresses?.[0]?.emailAddress,
          id: user?.id,
          name: user?.firstName,
        });

        if (error) throw error;

        // Remove the item after saving to ensure it runs only once
        await AsyncStorage.removeItem("@save-user-clerk-in-supabase");
      }
    } catch (error) {
      console.error("Error in one-time operation:", error);
    }
  }, [user, supabase]); // Dependencies to prevent re-execution

  useEffect(() => {
    performOperation();
  }, [performOperation]); // Ensures it runs only once per app lifecycle
};

export default useUserCreationInSupabase;
