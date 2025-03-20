import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";
import PostListItem from "../../../components/PostItem";
import { Tables } from "../../../types/database.types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../services/post.service";
import { useSupabase } from "../../../lib/supabse";
import { Comment } from "../../../../types";

export type PostWithGroupAndName = Tables<"posts"> & {
  // user: Tables<"users">;
  group: Tables<"groups">;
  upvotes: [{ sum: number }];
  comments: Tables<"comments">;
};

export default function HomeScreen() {
  const supabase = useSupabase();
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      return fetchPosts(
        { limit: pageParam.limit, offset: pageParam.offset },
        supabase
      );
    },
    staleTime: 10_000,
    initialPageParam: { limit: 3, offset: 0 },
    getNextPageParam: (lastPage, allPages, lastPageParams) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return { limit: 3, offset: allPages.flat().length };
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

  const posts = data?.pages?.flat() || [];

  return (
    <FlatList
      keyExtractor={(item: PostWithGroupAndName) => item.id}
      data={posts != undefined ? posts : []}
      renderItem={({ item }) => <PostListItem post={item} />}
      onRefresh={refetch}
      refreshing={isRefetching}
      onEndReachedThreshold={2}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size={"small"} style={{ marginTop: 10 }} />
        ) : null
      }
      onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
    />
  );
}
