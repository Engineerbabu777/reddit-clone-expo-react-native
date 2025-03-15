import { FlatList, View } from "react-native";
import PostListItem from "../../components/PostItem";
import posts from "../../../assets/data/posts.json";
import { Post } from "../../../types";

export default function HomeScreen() {
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
