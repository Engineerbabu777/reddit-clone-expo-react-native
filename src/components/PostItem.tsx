import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { PostWithGroupAndName } from "../app/(protected)/(tabs)";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUpvotes, selectMyVote } from "../services/upvotes.service";
import { useSupabase } from "../lib/supabse";
import { useSession } from "@clerk/clerk-expo";

type Props = {
  post: PostWithGroupAndName;
  isDetailedPost?: boolean;
};

const PostListItem = ({ post, isDetailedPost }: Props) => {
  const shouldSHowImage = isDetailedPost || post.image;
  const shouldShowDescription = isDetailedPost || !post.image;
  const router = useRouter();
  const { session } = useSession();

  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { mutate: upvotes } = useMutation({
    mutationFn: async (value: 1 | -1) => {
      return createUpvotes(post.id, value, supabase);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log({ data });
    }
  });

  const { data: myVote } = useQuery({
    queryKey: ["posts", post.id, "my-votes"],
    queryFn: async () => {
      return selectMyVote(post.id, session?.user?.id!, supabase);
    }
  });

  const isLiked = myVote?.value === 1;
  const isDisliked = myVote?.value === -1;

  const navigateToPost = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={navigateToPost} style={{ width: "100%" }}>
        <View>
          {/* POST HEADER! */}
          <View style={styles.header}>
            <Image source={{ uri: post.group.image! }} style={styles.image} />
            <View style={styles.headerTextContainer}>
              <View style={styles.headerTextRow}>
                <Text style={styles.groupName}>{post.group.name}</Text>
                <Text style={styles.timeAgo}>
                  {formatDistanceToNowStrict(new Date(post.created_at!))}
                </Text>
              </View>
              <View>{isDetailedPost && <Text>{post?.user?.name}</Text>}</View>
            </View>
            <View style={styles.joinButtonContainer}>
              <Text style={styles.joinButton}>Join</Text>
            </View>
          </View>

          {/* CONTENT! */}
          <Text style={styles.postTitleText}>{post?.title}</Text>
          {shouldSHowImage && post.image && (
            <Image source={{ uri: post.image! }} style={styles.postImage} />
          )}
          {shouldShowDescription && post.description && (
            <Text numberOfLines={4}>{post.description}</Text>
          )}
        </View>
      </Pressable>

      {/* FOOTER! */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.iconBox}>
            <Pressable
              onPress={() => {
                upvotes(1);
              }}
            >
              <MaterialCommunityIcons
                name="arrow-up-bold-outline"
                size={19}
                color={isLiked ? "crimson" : "black"}
              />
            </Pressable>
            <Text style={styles.iconText}>{post?.upvotes?.[0]?.sum || 0}</Text>
            <View style={styles.separator} />
            <Pressable
              onPress={() => {
                upvotes(-1);
              }}
            >
              <MaterialCommunityIcons
                name="arrow-down-bold-outline"
                size={19}
                color={isDisliked ? "crimson" : "black"}
              />
            </Pressable>
          </View>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons
              name="comment-outline"
              size={19}
              color="black"
            />
            <Text style={styles.iconText}>{post.nr_of_comments?.[0]?.count}</Text>
          </View>
        </View>
        <View style={styles.footerRight}>
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
  );
};

export default PostListItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    width: "100%"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1
  },
  headerTextRow: {
    flexDirection: "row",
    gap: 5
  },
  groupName: {
    fontWeight: "bold"
  },
  timeAgo: {
    color: "grey"
  },
  joinButtonContainer: {
    marginLeft: "auto"
  },
  joinButton: {
    backgroundColor: "#0d469b",
    color: "white",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
    fontWeight: "bold"
  },
  postTitleText: {
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5
  },
  postImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 15
  },
  footer: {
    flexDirection: "row",
    marginTop: 10
  },
  footerLeft: {
    flexDirection: "row",
    gap: 10
  },
  footerRight: {
    marginLeft: "auto",
    flexDirection: "row",
    gap: 10
  },
  iconBox: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#D4D4D4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  iconText: {
    fontWeight: "500",
    marginLeft: 5,
    alignSelf: "center"
  },
  separator: {
    width: 1,
    backgroundColor: "#D4D4D4",
    height: 14,
    marginHorizontal: 7,
    alignSelf: "center"
  }
});
