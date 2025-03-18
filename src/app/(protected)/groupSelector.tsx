import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { selectedGroupAtom } from "../../atoms";
import { Group } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../../services/group.service";

export default function GroupSelector() {
  const [searchText, setSearchText] = useState<string>("");
  const setGroup = useSetAtom(selectedGroupAtom);

  const { isLoading, error, data } = useQuery({
    queryKey: ["groups", { searchText }],
    queryFn: async () => fetchGroups(searchText),
    placeholderData: (previousData) => previousData,
    staleTime: 10_000
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

  if (error || !data) {
    return <Text>Post not found</Text>;
  }

  return (
    <>
      <SafeAreaView
        style={{
          marginHorizontal: 10,
          flex: 1
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <AntDesign
            name="close"
            size={30}
            color={"black"}
            onPress={() => router.back()}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              paddingRight: 30,
              flex: 1
            }}
          >
            Post to
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "lightgrey",
            borderRadius: 5,
            gap: 5,
            marginVertical: 10,
            alignItems: "center",
            paddingHorizontal: 5
          }}
        >
          <AntDesign name="search1" size={16} color={"black"} />
          <TextInput
            placeholder="Search for a community"
            placeholderTextColor={"grey"}
            style={{
              paddingVertical: 10,
              flex: 1
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText && (
            <>
              <AntDesign
                name="closecircle"
                size={15}
                color={"#E4E4E4"}
                onPress={() => setSearchText("")}
              />
            </>
          )}
        </View>

        <FlatList
          data={filteredGroups}
          renderItem={({ item }: { item: Group }) => (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginBottom: 25
              }}
              onPress={() => {
                setGroup(item);
                router.back();
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 40,
                  aspectRatio: 1,
                  borderRadius: 20
                }}
              />
              <Text
                style={{
                  fontWeight: "600"
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </>
  );
}
