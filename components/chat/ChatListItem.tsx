import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import SwipeActions from "./SwipeActions";

import { SharedValue } from "react-native-reanimated";

//채팅 목록 컴포넌트
export type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
};

type ChatListItemProps = {
  item: ChatPreview;
  onPress: (id: string) => void;
};

const ChatListItem = ({ item, onPress }: ChatListItemProps) => {
  return (
    <ReanimatedSwipeable
      friction={2} //얼마나 무겁게(저항 있게) 움직일지
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={(
        prog: SharedValue<number>,
        drag: SharedValue<number>
      ) => <SwipeActions prog={prog} drag={drag} />}
    >
      {/* <Pressable style={styles.row} onPress={() => onPress(item.id)}> */}
      <View style={styles.row}>
        <View style={styles.avatar} />
        <View style={styles.rowTextWrap}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
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
