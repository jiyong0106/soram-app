import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
};

type Props = {
  item: ChatPreview;
  onPress: (id: string) => void;
  renderRightActions?: () => ReactNode;
};

export default function ChatListItem({
  item,
  onPress,
  renderRightActions,
}: Props) {
  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <Pressable style={styles.row} onPress={() => onPress(item.id)}>
        <View style={styles.avatar} />
        <View style={styles.rowTextWrap}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E9ECEF",
    marginRight: 12,
  },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  rowSubtitle: { color: "#8A8F98" },
});
