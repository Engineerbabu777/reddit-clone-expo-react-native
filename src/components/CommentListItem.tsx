import { View, Text, Image, Pressable, FlatList } from "react-native";
import { Entypo, Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { useState, useRef, memo } from "react";
import { Comment } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "../lib/supabse";
import { deleteComment, fetchReplies } from "../services/comment.service";
import { useSession } from "@clerk/clerk-expo";

type CommentListItemProps = {
  comment: Comment;
  depth: number;
  handleReply: (commentId: string) => void;
};

const CommentListItem = ({
  comment,
  depth = 0,
  handleReply
}: CommentListItemProps) => {
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false);
  const { session } = useSession();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { data: replies } = useQuery({
    queryKey: ["replies", { parentId: comment.id }],
    queryFn: () => fetchReplies(comment.id, supabase)
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: async () => {
      return deleteComment(comment.id, supabase);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { postId: comment.post_id }]
      });
      queryClient.invalidateQueries({
        queryKey: ["replies", { parentId: comment.parent_id }]
      });
    }
  });

  return (
    <View
      style={{
        backgroundColor: "white",
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
        borderLeftColor: "#E5E7EB",
        borderLeftWidth: depth > 0 ? 1 : 0
      }}
    >
      {/* User Info */}
      {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
        <Image
          source={{
            uri:
              comment.user.image ||
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg"
          }}
          style={{ width: 28, height: 28, borderRadius: 15, marginRight: 4 }}
        />
        <Text style={{ fontWeight: "600", color: "#737373", fontSize: 13 }}>
          {comment.user.name}
        </Text>
        <Text style={{ color: "#737373", fontSize: 13 }}>&#x2022;</Text>
        <Text style={{ color: "#737373", fontSize: 13 }}>
          {formatDistanceToNowStrict(new Date(comment.created_at))}
        </Text>
      </View> */}

      {/* Comment Content */}
      <Text>{comment.comment}</Text>

      {/* Comment Actions */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 14
        }}
      >
        {session?.user.id === comment.user.id && (
          <Entypo
            name="trash"
            size={15}
            color="#737373"
            onPress={() => removeComment()}
          />
        )}
        <Octicons
          name="reply"
          size={16}
          color="#737373"
          onPress={() => handleReply(comment.id)}
        />
        <MaterialCommunityIcons
          name="trophy-outline"
          size={16}
          color="#737373"
        />
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <MaterialCommunityIcons
            name="arrow-up-bold-outline"
            size={18}
            color="#737373"
          />
          <Text style={{ fontWeight: "500", color: "#737373" }}>
            {comment.upvotes}
          </Text>
          <MaterialCommunityIcons
            name="arrow-down-bold-outline"
            size={18}
            color="#737373"
          />
        </View>
      </View>
      {/* Show replies! */}
      {!!replies?.length && !isShowReplies && depth < 5 && (
        <Pressable
          style={{
            backgroundColor: "#ededed",
            borderRadius: 2,
            paddingVertical: 3,
            alignItems: "center"
          }}
          onPress={() => {
            setIsShowReplies(true);
          }}
        >
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontWeight: "500",
              color: "#545454"
            }}
          >
            Show replies
          </Text>
        </Pressable>
      )}

      {/* List of Replies */}
      {/* {isShowReplies && (
        <FlatList
          data={comment.replies}
          renderItem={({ item }: any) => (
            <>
              <CommentListItem
                comment={item}
                depth={depth + 1}
                handleReply={handleReply}
              />
            </>
          )}
        />
      )} */}
      {isShowReplies && !!replies?.length && (
        <>
          {replies.map((item: any) => (
            <CommentListItem
              key={item.id}
              comment={item}
              depth={depth + 1}
              handleReply={handleReply}
            />
          ))}
        </>
      )}
    </View>
  );
};

export default memo(CommentListItem);
