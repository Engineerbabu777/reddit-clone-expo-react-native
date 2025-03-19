import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import PostListItem from "../../../components/PostItem";
import comments from "../../../../assets/data/comments.json";
import CommentListItem from "../../../components/CommentListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator, Alert } from "react-native";
import { router, Stack } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePostById,
  fetchComments,
  fetchPostById
} from "../../../services/post.service";
import { useSupabase } from "../../../lib/supabse";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function DetailedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const supabase = useSupabase();

  const [comment, setComment] = useState<string>("");
  const [isInputFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const insets = useSafeAreaInsets();

  // FETCHING ---
  const queryClient = useQueryClient();

  const {
    data: post,
    error,
    isLoading
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      return fetchPostById(id, supabase);
    },
    staleTime: 10_000
  });

  const {data:comments} = useQuery({
    queryKey: ["comments", { postOd: id }],
    queryFn: () => fetchComments(id, supabase)
  });

  const { mutate: remove } = useMutation({
    mutationFn: async () => {
      deletePostById(id, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
    onError: () => {
      Alert.alert("Error Deleting Post!!", error?.message);
    }
  });

  // FECTHING ---

  const handleReplyButtonPressed = useCallback((commentId: string) => {
    console.log({ commentId });
    inputRef.current?.focus();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  if (error || !post) {
    return <Text>Post not found</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 10}
      style={{
        flex: 1
      }}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10
                }}
              >
                <Entypo
                  name="trash"
                  size={24}
                  color={"white"}
                  onPress={() => remove()}
                />
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
      <FlatList
        data={comments}
        renderItem={({ item }: any) => (
          <>
            <CommentListItem
              comment={item}
              depth={0}
              handleReply={handleReplyButtonPressed}
            />
          </>
        )}
        ListHeaderComponent={<PostListItem post={post} isDetailedPost />}
      />

      <View
        style={{
          paddingBottom: insets.bottom,

          borderColor: "lightgray",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Join the conversation"
          style={{
            backgroundColor: "#E4E4E4",
            padding: 5,
            borderRadius: 5
          }}
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isInputFocused && (
          <Pressable
            style={{
              backgroundColor: "#0d469b",
              borderRadius: 15,
              marginLeft: "auto",
              marginTop: 15
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontWeight: "bold",
                fontSize: 13
              }}
            >
              Reply
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
