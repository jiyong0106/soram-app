import React, { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NotificationListItem } from "@/utils/types/auth";

type Props = {
  item: NotificationListItem;
  onPress: (item: NotificationListItem) => void;
};

// 알림 아이템 단일 컴포넌트 (단일 책임)
const AlertItem = ({ item, onPress }: Props) => {
  // createdAt 문자열을 사람이 읽기 쉬운 포맷으로 변환
  const createdAtLabel = useMemo(() => {
    try {
      return new Date(item.createdAt).toLocaleString();
    } catch {
      return item.createdAt;
    }
  }, [item.createdAt]);

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.container, !item.isRead && styles.unreadContainer]}
      activeOpacity={0.8}
    >
      <View style={styles.headerRow}>
        {!item.isRead && <View style={styles.unreadDot} />}
        <Text
          numberOfLines={1}
          style={[styles.title, !item.isRead && styles.titleUnread]}
        >
          {item.title}
        </Text>
      </View>
      <Text numberOfLines={2} style={styles.body}>
        {item.body}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.date}>{createdAtLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(AlertItem);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  unreadContainer: {
    backgroundColor: "#FFF9F2",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF7A00",
    marginRight: 6,
  },
  title: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    flex: 1,
  },
  titleUnread: {
    color: "#111",
  },
  body: {
    fontSize: 13,
    color: "#444",
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeChip: {
    fontSize: 11,
    color: "#6A5F58",
    backgroundColor: "#F2ECE9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  date: {
    fontSize: 11,
    color: "#888",
  },
});
