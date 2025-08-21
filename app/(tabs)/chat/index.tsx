import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import SearchBar from "@/components/chat/SearchBar";
import ChatItem from "@/components/chat/ChatItem";
import { useQuery } from "@tanstack/react-query";
import { getChat } from "@/utils/api/chatPageApi";
import { GetChatResponse } from "@/utils/types/chat";

const chatPage = () => {
  const [query, setQuery] = useState("");

  const { data } = useQuery<GetChatResponse[]>({
    queryKey: ["getChatKey"],
    queryFn: () => getChat(),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>채팅</Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => <ChatItem item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>메세지 없음</Text>}
      />
    </View>
  );
};

export default chatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
});
