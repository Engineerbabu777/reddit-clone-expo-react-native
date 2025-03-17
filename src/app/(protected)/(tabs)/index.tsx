import { FlatList, View } from "react-native";
import PostListItem from "../../../components/PostItem";
import { Tables } from "../../../types/database.types";

import { supabase } from "../../../lib/supabse";
import { useEffect, useState } from "react";

export type PostWithGroupAndName = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<PostWithGroupAndName[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");

    if (error) {
      console.log({ error });
    } else {
      setPosts(data);
    }
  };

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
