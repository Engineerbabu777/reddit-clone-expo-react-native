import { Text, View, Image, StyleSheet } from "react-native";
import posts from "../../../assets/data/posts.json";
import PostListItem from "../../components/postListItem";

export default function HomeScreen() {
  const post = posts?.[0];
  return (
    <>
      <PostListItem />
    </>
  );
}
