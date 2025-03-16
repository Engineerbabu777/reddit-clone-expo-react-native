import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");

  const goBack = () => {
    setTitle("");
    setBodyText("");

    router.back();
  };

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
          paddingHorizontal: 10
        }}
      >
        {/* HEADER! */}
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <AntDesign name="close" size={30} color={"black"} />
          <Pressable
            onPress={() => {
              goBack();
            }}
            style={{
              marginLeft: "auto"
            }}
          >
            <Text style={styles.postText}>Post</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* COMMUNITY SELECTOR! */}
            <View style={styles.communityContainer}>
              <Text style={styles.rStyles}>r/</Text>
              <Text style={{ fontWeight: "600" }}>Select a community</Text>
            </View>

            {/* INPUTS */}
            <TextInput
              placeholder="Title"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                paddingVertical: 20
              }}
              value={title}
              onChangeText={setTitle}
              multiline
              scrollEnabled={false}
            />

            <TextInput
              placeholder="Body Text (optional)"
              value={bodyText}
              onChangeText={setBodyText}
              multiline
              scrollEnabled={false}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  postText: {
    backgroundColor: "#115BCA",
    color: "white",
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10
  },
  rStyles: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10
  },
  communityContainer: {
    flexDirection: "row",
    backgroundColor: "#EDEDED",
    padding: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    margin: 10,
    gap: 5
  }
});
