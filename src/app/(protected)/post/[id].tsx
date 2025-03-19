import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import React, { useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import posts from "../../../../assets/data/posts.json";
import PostListItem from "../../../components/PostItem";
import comments from "../../../../assets/data/comments.json";
import CommentListItem from "../../../components/CommentListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailedPost() {
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState<string>("");
  const [isInputFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const insets = useSafeAreaInsets();

  const detailedPost = posts.find((post) => post.id === id);

  const handleReplyButtonPressed = (commentId: string) => {
    console.log({ commentId });
    inputRef.current?.focus();
  };

  const postComments = comments.filter(
    (comment) => comment.post_id === "post-1"
  );

  if (!detailedPost) {
    return <Text>Post not found</Text>;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 10}
      style={{
        flex: 1
      }}
    >
      <FlatList
        data={postComments}
        renderItem={({ item }: any) => (
          <>
            <CommentListItem
              comment={item}
              depth={0}
              handleReply={handleReplyButtonPressed}
            />
          </>
        )}
        ListHeaderComponent={
          <PostListItem post={detailedPost} isDetailedPost />
        }
      />

      <View
        style={{
          paddingBottom: insets.bottom,
          // borderBottomWidth: 1,
          borderColor: "lightgray",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10
          // shadowColor: "#000",
          // shadowOffset: {
          //   width: 0,
          //   height: 2
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 3.84,

          // elevation: 5
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Join the conversation"
          style={{
            backgroundColor: "#E4E4E4",
            padding: 5,
            borderRadius: 5
          }}
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isInputFocused && (
          <Pressable
            style={{
              backgroundColor: "#0d469b",
              borderRadius: 15,
              marginLeft: "auto",
              marginTop: 15
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontWeight: "bold",
                fontSize: 13
              }}
            >
              Reply
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
