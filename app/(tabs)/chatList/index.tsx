import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import SearchBar from "@/components/chat/SearchBar";
import ChatListItem, {
  ChatPreview as ChatPreviewItem,
} from "@/components/chat/ChatListItem";
import SwipeActions from "@/components/chat/SwipeActions";
import PageContainer from "@/components/common/PageContainer";

const SAMPLE_CHATS: ChatPreviewItem[] = [
  {
    id: "1",
    name: "가나다라마바사",
    lastMessage: "가나다라마바사아자차카타파하가나다라",
  },
  {
    id: "2",
    name: "가나다라마바사",
    lastMessage: "가나다라마바사아자차카타파하가나다라",
  },
  {
    id: "3",
    name: "가나다라마바사",
    lastMessage: "가나다라마바사아자차카타파하가나다라",
  },
  {
    id: "4",
    name: "가나다라마바사",
    lastMessage: "가나다라마바사아자차카타파하가나다라",
  },
];

const ChatListPage = () => {
  const [query, setQuery] = useState("");
  const data = useMemo(
    () =>
      SAMPLE_CHATS.filter((c) =>
        [c.name, c.lastMessage].some((t) =>
          t.toLowerCase().includes(query.toLowerCase())
        )
      ),
    [query]
  );

  const renderActions = () => <SwipeActions />;

  const renderItem = ({ item }: { item: ChatPreviewItem }) => (
    <ChatListItem
      item={item}
      onPress={(id) => router.push({ pathname: "/chat/[id]", params: { id } })}
      renderRightActions={renderActions}
    />
  );

  return (
    <PageContainer>
      <Text style={styles.title}>채팅</Text>
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
      />
    </PageContainer>
  );
};

export default ChatListPage;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  rowSubtitle: { color: "#8A8F98" },
});
