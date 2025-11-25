import React, { useRef, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import TopicSectionLists from "./TopicSectionLists";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import {
  TopicListType,
  GetTopicListResponse,
  Category,
  SortByType,
} from "@/utils/types/topic";
import { getTopicList } from "@/utils/api/topicPageApi";
import LoadingSpinner from "../common/LoadingSpinner";

interface Props {
  category: Category;
  sortBy: SortByType;
  debouncedSearchName: string;
}

const TopicSection = ({ category, sortBy, debouncedSearchName }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const isAll = !category || category === "전체";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery<GetTopicListResponse>({
      // 카테고리를 key에 포함해서 탭별 캐시를 분리
      queryKey: ["getTopicListKey", debouncedSearchName, category, sortBy],
      queryFn: ({ pageParam }) =>
        getTopicList({
          take: 10,
          cursor: pageParam,
          search: debouncedSearchName || "",
          category: isAll ? undefined : category,
          sortBy,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
      staleTime: 60 * 1000,
      placeholderData: keepPreviousData,
    });
  // 받은 페이지들을 합치고, 클라이언트에서 카테고리만 필터
  const items: TopicListType[] = data?.pages.flatMap((p) => p.data) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <TopicSectionLists item={item} />}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: 15,
        paddingTop: 10,
        paddingBottom: 100,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#FF7D4A"]}
          tintColor="#FF7D4A"
        />
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.2}
      ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
    />
  );
};

export default TopicSection;

const styles = StyleSheet.create({});

// import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
// import { useState } from "react";
// import { Ionicons } from "@expo/vector-icons";

// type SearchBarProps = {
//   value: string;
//   onChangeText: (text: string) => void;
// };

// const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
//   const [focused, setFocused] = useState(false);
//   return (
//     <View style={[styles.container, focused && styles.searchWrapFocused]}>
//       <TextInput
//         style={styles.input}
//         placeholder="검색"
//         value={value}
//         onChangeText={onChangeText}
//         placeholderTextColor="#B0A6A0"
//         onFocus={() => setFocused(true)}
//         onBlur={() => setFocused(false)}
//       />
//       {focused && (
//         <TouchableOpacity
//           onPress={() => onChangeText("")}
//           style={styles.clearButton}
//         >
//           <Ionicons name="close-circle" size={18} color="#B0A6A0" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default SearchBar;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#B0A6A0",
//     // paddingHorizontal: 12,
//     height: 40,
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//     backgroundColor: "red",
//   },
//   searchWrapFocused: {
//     borderColor: "#FF6B3E", // 포커스 시 테두리
//   },
//   clearButton: {
//     padding: 6, // 터치 여유
//   },
// });
