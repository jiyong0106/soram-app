import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const isSwipingRef = useRef(false); // 스와이프 제스처 중/직후 true
  const isOpenRef = useRef(false); // 액션이 열려 있는지 여부(선택)

  // 스와이프 직후 잠깐(예: 150ms) 탭 무시
  const blockTapBriefly = () => {
    isSwipingRef.current = true;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 150);
  };

  const handleRowPress = () => {
    if (isSwipingRef.current || isOpenRef.current) return; // 스와이프 중/열려있으면 무시
    onPress(item.id);
  };
  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      overshootRight={false}
      // 스와이프 시작/닫힘 제스처 중엔 탭 블록
      onSwipeableWillOpen={blockTapBriefly}
      onSwipeableWillClose={blockTapBriefly}
      // // 열림 상태 추적(원하면 탭 막기용)
      onSwipeableOpen={() => {
        isOpenRef.current = true;
      }}
      onSwipeableClose={() => {
        isOpenRef.current = false;
      }}
      renderRightActions={(
        prog: SharedValue<number>,
        drag: SharedValue<number>
      ) => <SwipeActions prog={prog} drag={drag} />}
    >
      <TouchableOpacity
        style={styles.row}
        onPress={handleRowPress}
        activeOpacity={0.5}
      >
        <View style={styles.avatar} />
        <View style={styles.rowTextWrap}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
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
