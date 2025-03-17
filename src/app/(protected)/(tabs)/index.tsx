import { FlatList, View } from "react-native";
import PostListItem from "../../../components/PostItem";
import { Post } from "../../../../types";

import { supabase } from "../../../lib/supabse";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");
    setPosts(data);
  };

  return (
    <View>
      <FlatList
        keyExtractor={(item: Post) => item.id}
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}
