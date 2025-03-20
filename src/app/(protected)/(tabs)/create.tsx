import * as ImagePicker from "expo-image-picker";

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
import { AntDesign, Feather } from "@expo/vector-icons";
import { Database, TablesInsert } from "../../../types/database.types";
import { Link, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SafeAreaView } from "react-native-safe-area-context";
import { SupabaseClient } from "@supabase/supabase-js";
import { selectedGroupAtom } from "../../../atoms";
import { useAtom } from "jotai";
import { useState } from "react";
import { useSupabase } from "../../../lib/supabse";

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
  const [image, setImage] = useState<string | null>(null);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
          style={{
            flex: 1
          }}
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

            {image && (
              <View style={{ paddingBottom: 20 }}>
                <AntDesign
                  name="close"
                  size={25}
                  color="white"
                  onPress={() => setImage(null)}
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    right: 10,
                    top: 10,
                    padding: 5,
                    backgroundColor: "#00000090",
                    borderRadius: 20
                  }}
                />
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", aspectRatio: 1 }}
                />
              </View>
            )}

            <TextInput
              placeholder="Body Text (optional)"
              value={bodyText}
              onChangeText={setBodyText}
              multiline
              scrollEnabled={false}
            />
          </ScrollView>
          {/* FOOTER */}
          <View style={{ flexDirection: "row", gap: 20, padding: 10 }}>
            <Feather name="link" size={20} color="black" />
            <Feather name="image" size={20} color="black" onPress={pickImage} />
            <Feather name="youtube" size={20} color="black" />
            <Feather name="list" size={20} color="black" />
          </View>
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
