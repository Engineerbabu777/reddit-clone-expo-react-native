import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import posts from "../../../../assets/data/posts.json";
import PostListItem from "../../../components/PostItem";

export default function DetailedPost() {
  const { id } = useLocalSearchParams();

  const detailedPost = posts.find((post) => post.id === id);

  if (!detailedPost) {
    return <Text>Post not found</Text>;
  }
  return (
    <View>
      <PostListItem post={detailedPost} isDetailedPost/>
    </View>
  );
}

const styles = StyleSheet.create({});
