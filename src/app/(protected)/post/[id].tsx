import { ActivityIndicator, Alert, Text, View } from "react-native";
import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import PostListItem from "../../../components/PostItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePostById, fetchPostById } from "../../../services/post.service";
import { useSupabase } from "../../../lib/supabse";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Comments from  '../../../../assets/data/comments.json';

export default function DetailedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const supabase = useSupabase();

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
    <View>
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
      <PostListItem post={post} isDetailedPost />
    </View>
  );
}
