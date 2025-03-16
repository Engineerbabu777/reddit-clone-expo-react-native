import {
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
import groups from "../../../assets/data/groups.json";
import { useSetAtom } from "jotai";
import { selectedGroupAtom } from "../../atoms";
import { Group } from "../../../types";

export default function GroupSelector() {
  const [searchText, setSearchText] = useState<string>("");
  const setGroup = useSetAtom(selectedGroupAtom);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
