import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PostListItem from "../../../components/PostItem";
import { Tables } from "../../../types/database.types";

import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../services/post.service";

export type PostWithGroupAndName = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

export default function HomeScreen() {
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return fetchPosts();
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

  if (error) {
    return <Text>Error</Text>;
  }

  return (
    <View>
      <FlatList
        keyExtractor={(item: PostWithGroupAndName) => item.id}
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}
