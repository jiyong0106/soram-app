import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import SearchBar from "@/components/chat/SearchBar";
import ChatListItem, {
  ChatPreview as ChatPreviewItem,
} from "@/components/chat/ChatListItem";
import PageContainer from "@/components/common/PageContainer";
import { SAMPLE_CHATS } from "@/utils/dummy/test";
import { getConnections } from "@/utils/api/chatPageApi";

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

  const renderItem = ({ item }: { item: ChatPreviewItem }) => (
    <ChatListItem
      item={item}
      onPress={(id) => router.push({ pathname: "/chat/[id]", params: { id } })}
    />
  );

  return (
    <PageContainer edges={["top"]} padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </PageContainer>
  );
};

export default ChatListPage;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  rowSubtitle: {
    color: "#8A8F98",
  },
});
