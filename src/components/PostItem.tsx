import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
import { PostWithGroupAndName } from "../app/(protected)/(tabs)";

type Props = {
  post: PostWithGroupAndName;
  isDetailedPost?: boolean;
};

const PostListItem = ({ post, isDetailedPost }: Props) => {
  const shouldSHowImage = isDetailedPost || post.image;
  const shouldShowDescription = isDetailedPost || !post.image;

  return (
    <Link href={`/post/${post.id}`}>
      <View style={styles.container}>
        {/* POST HEADER! */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5
          }}
        >
          <Image source={{ uri: post.group.image! }} style={styles.image} />
          <View
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 5
              }}
            >
              <Text
                style={{
                  fontWeight: "bold"
                }}
              >
                {post.group.name}
              </Text>
              <Text
                style={{
                  color: "grey"
                }}
              >
                {formatDistanceToNowStrict(new Date(post.created_at!))}
              </Text>
            </View>

            <View>{isDetailedPost && <Text>{post?.user?.name}</Text>}</View>
          </View>

          <View
            style={{
              marginLeft: "auto"
            }}
          >
            <Text style={styles.joinButton}>Join</Text>
          </View>
        </View>

        {/* CONTENT! */}
        <Text style={styles.postTitleText}>{post?.title}</Text>
        {shouldSHowImage && post.image && (
          <Image
            source={{ uri: post.image! }}
            style={{
              width: "100%",
              aspectRatio: 4 / 3,
              borderRadius: 15
            }}
          />
        )}
        {shouldShowDescription && post.description && (
          <Text numberOfLines={4}>{post.description}</Text>
        )}

        {/* FOOTER! */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[{ flexDirection: "row" }, styles.iconBox]}>
              <MaterialCommunityIcons
                name="arrow-up-bold-outline"
                size={19}
                color="black"
              />
              <Text
                style={{
                  fontWeight: "500",
                  marginLeft: 5,
                  alignSelf: "center"
                }}
              >
                {post?.upvotes?.[0]?.sum || 0}
              </Text>
              <View
                style={{
                  width: 1,
                  backgroundColor: "#D4D4D4",
                  height: 14,
                  marginHorizontal: 7,
                  alignSelf: "center"
                }}
              />
              <MaterialCommunityIcons
                name="arrow-down-bold-outline"
                size={19}
                color="black"
              />
            </View>
            <View style={[{ flexDirection: "row" }, styles.iconBox]}>
              <MaterialCommunityIcons
                name="comment-outline"
                size={19}
                color="black"
              />
              <Text
                style={{
                  fontWeight: "500",
                  marginLeft: 5,
                  alignSelf: "center"
                }}
              >
                {post.nr_of_comments}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: "auto", flexDirection: "row", gap: 10 }}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={19}
              color="black"
              style={styles.iconBox}
            />
            <MaterialCommunityIcons
              name="share-outline"
              size={19}
              color="black"
              style={styles.iconBox}
            />
          </View>
        </View>
      </View>
    </Link>
  );
};

export default PostListItem;

const styles = StyleSheet.create({
  joinButton: {
    backgroundColor: "#0d469b",
    color: "white",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
    fontWeight: "bold"
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    flex: 1,
    width: "100%"
  },
  postTitleText: {
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5
  },
  iconBox: {
    borderWidth: 0.5,
    borderColor: "#D4D4D4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  }
});
