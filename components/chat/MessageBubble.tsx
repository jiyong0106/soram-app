import { ChatMessageType } from "@/utils/types/chat";
import { formatKoClock } from "@/utils/util/formatKoClock";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type MessageBubbleProps = {
  item: ChatMessageType;
  isMine: boolean;
  showTime?: boolean;
};

const MessageBubble = ({ item, isMine, showTime }: MessageBubbleProps) => {
  const { content, createdAt } = item;
  const timeText = formatKoClock(createdAt);

  if (isMine) {
    // 내 메시지: 시간 ← 말풍선 (오른쪽 정렬)
    return (
      <View style={[styles.row, styles.rowMine]}>
        {showTime && <Text style={styles.timeText}>{timeText}</Text>}
        <View style={[styles.bubble, styles.bubbleMine]}>
          <Text style={[styles.bubbleText, styles.mineText]}>{content}</Text>
        </View>
      </View>
    );
  }

  // 상대 메시지: 말풍선 → 시간 (왼쪽 정렬)
  return (
    <View style={[styles.row, styles.rowOther]}>
      <View style={[styles.bubble, styles.bubbleOther]}>
        <Text style={styles.bubbleText}>{content}</Text>
      </View>
      {showTime && <Text style={styles.timeText}>{timeText}</Text>}
    </View>
  );
};

export default React.memo(MessageBubble);

const styles = StyleSheet.create({
  // 한 줄에 배치 + 하단 정렬
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  rowMine: {
    justifyContent: "flex-end",
  },
  rowOther: {
    justifyContent: "flex-start",
  },

  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "80%",
    marginHorizontal: 2,
  },
  bubbleMine: {
    backgroundColor: "#FF6F6F",
  },
  bubbleOther: {
    backgroundColor: "#EFF1F5",
  },

  bubbleText: {
    fontSize: 15,
    color: "#111",
  },
  mineText: {
    color: "#fff",
  },

  timeText: {
    fontSize: 10,
    marginHorizontal: 2, // 말풍선과 간격
    color: "rgba(17,17,17,0.55)",
  },
});
