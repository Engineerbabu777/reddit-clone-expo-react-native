import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PostListItem from "../../../components/PostItem";
import { Tables } from "../../../types/database.types";

import { supabase } from "../../../lib/supabse";
import { useQuery } from "@tanstack/react-query";

export type PostWithGroupAndName = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");

  if (error) {
    throw error;
  } else {
    return data;
  }
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
