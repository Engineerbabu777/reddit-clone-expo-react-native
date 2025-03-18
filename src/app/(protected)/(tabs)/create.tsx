import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAtom } from "jotai";
import { selectedGroupAtom } from "../../../atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, useSupabase } from "../../../lib/supabse";
import { Database, TablesInsert } from "../../../types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

type InsertPost = TablesInsert<"posts">;
const insertPost = async (
  post: InsertPost,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const supabase = useSupabase();
  const [group, setGroup] = useAtom(selectedGroupAtom);

  const queryClient = useQueryClient();

  const { isPending, data, mutate } = useMutation({
    mutationFn: async () => {
      if (!group) {
        throw new Error("Group is required");
      }

      if (!title) {
        throw new Error("Title is required");
      }

      return insertPost(
        {
          description: bodyText,
          title,
          group_id: group?.id,
          created_at: new Date().toUTCString()
        },
        supabase
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      goBack();
    },
    onError: (error) => {
      Alert.alert("Failed to insert!!", error.message);
      console.log({ error });
    }
  });

  const goBack = () => {
    setTitle("");
    setBodyText("");
    setGroup(null);
    router.back();
  };

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
          paddingHorizontal: 10
        }}
      >
        {/* HEADER! */}
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <AntDesign
            name="close"
            size={30}
            color={"black"}
            onPress={() => {
              goBack();
            }}
          />
          <Pressable
            style={{
              marginLeft: "auto"
            }}
            onPress={() => mutate()}
            disabled={isPending}
          >
            <Text style={styles.postText}>
              {isPending ? "Posting" : "Post"}
            </Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* COMMUNITY SELECTOR! */}
            <Link href={"groupSelector"} asChild>
              <Pressable style={styles.communityContainer}>
                {group ? (
                  <>
                    <Image
                      source={{ uri: group.image }}
                      style={{ width: 20, height: 20, borderRadius: 10 }}
                    />
                    <Text>{group.name}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.rStyles}>r/</Text>
                    <Text style={{ fontWeight: "600" }}>
                      Select a community
                    </Text>
                  </>
                )}
              </Pressable>
            </Link>

            {/* INPUTS */}
            <TextInput
              placeholder="Title"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                paddingVertical: 20
              }}
              value={title}
              onChangeText={setTitle}
              multiline
              scrollEnabled={false}
            />

            <TextInput
              placeholder="Body Text (optional)"
              value={bodyText}
              onChangeText={setBodyText}
              multiline
              scrollEnabled={false}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  postText: {
    backgroundColor: "#115BCA",
    color: "white",
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10
  },
  rStyles: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10
  },
  communityContainer: {
    flexDirection: "row",
    backgroundColor: "#EDEDED",
    padding: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    margin: 10,
    gap: 5
  }
});
