import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import SearchBar from "@/components/connections/SearchBar";
import ConnectionsItem, {
  ConnectionsPreview as ConnectionsPreview,
} from "@/components/connections/ConnectionsItem";
import { SAMPLE_CHATS } from "@/utils/dummy/test";

const ConnectionsPage = () => {
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

  const renderItem = ({ item }: { item: ConnectionsPreview }) => (
    <ConnectionsItem
      item={item}
      onPress={(id) =>
        router.push({ pathname: "/connections/[id]", params: { id } })
      }
    />
  );

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default ConnectionsPage;

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
});
