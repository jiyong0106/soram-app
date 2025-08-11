import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
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
  { id: "7", text: "가나다라마", isMine: false },
  { id: "8", text: "가나다라마", isMine: false },
  { id: "9", text: "가나다라마", isMine: false },
  { id: "10", text: "가나다라마", isMine: true },
  { id: "11", text: "가나다라마", isMine: true },
  { id: "12", text: "가나다라마", isMine: false },
  { id: "13", text: "가나다라마", isMine: true },
  { id: "14", text: "가나다라마", isMine: false },
  { id: "16", text: "가나다라마", isMine: true },
];

const ChatDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [text, setText] = useState("");
  const [messages] = useState<Message[]>(SAMPLE_MESSAGES);
  const flatListRef = useRef<FlatList<Message>>(null);

  const headerTitle = useMemo(() => "가나다라마바사", [id]);

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble text={item.text} isMine={item.isMine} />
  );

  const onSend = () => {
    Alert.alert("메세지 전송");
  };

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerShown: true,
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
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 15,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        />

        <MessageInputBar value={text} onChangeText={setText} onSend={onSend} />
      </KeyboardAvoidingView>
    </PageContainer>
  );
};

export default ChatDetailPage;

const styles = StyleSheet.create({});
