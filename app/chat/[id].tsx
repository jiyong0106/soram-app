import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInputBar from "@/components/chat/MessageInputBar";
import PageContainer from "@/components/common/PageContainer";

type Message = {
  id: string;
  text: string;
  isMine: boolean;
};

const SAMPLE_MESSAGES: Message[] = [
  { id: "1", text: "가나다라마", isMine: false },
  { id: "2", text: "가나다라마", isMine: true },
  { id: "3", text: "가나다라가나다라마", isMine: true },
  { id: "4", text: "가나다라마", isMine: false },
  { id: "5", text: "가나다라가나다라마", isMine: true },
  { id: "6", text: "가나다라마", isMine: false },
];

export default function ChatDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [text, setText] = useState("");
  const [messages] = useState<Message[]>(SAMPLE_MESSAGES);
  const flatListRef = useRef<FlatList<Message>>(null);

  const headerTitle = useMemo(() => "가나다라마바사", [id]);

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble text={item.text} isMine={item.isMine} />
  );

  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Ionicons name="call-outline" size={22} />
              <Ionicons name="ellipsis-vertical" size={20} />
            </View>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
        />

        <MessageInputBar value={text} onChangeText={setText} />
      </KeyboardAvoidingView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({});
