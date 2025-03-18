import { ActivityIndicator, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import PostListItem from "../../../components/PostItem";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "../../../services/post.service";
import { useSupabase } from "../../../lib/supabse";

export default function DetailedPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const supabase = useSupabase();

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
      <PostListItem post={post} isDetailedPost />
    </View>
  );
}
