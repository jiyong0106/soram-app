// app/components/connection/ReceivedRequestsCard.tsx

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../common/AppText";
import Button from "../common/Button";
import { formatRelative } from "@/utils/util/formatRelative";
import { getInitials } from "@/utils/util/uiHelpers";
import { Ionicons } from "@expo/vector-icons";

// --- Types ---
// 백엔드 응답에 맞춘 새로운 타입 정의
// 1. 답변 미리보기 타입
interface RequesterResponsePreview {
  id: number;
  type: "TEXT" | "VOICE";
  contentPreview: string | null;
  playtime: number | null;
}

// 2. 받은 요청 데이터의 전체 타입
interface ReceivedRequestItem {
  id: number; // connectionId
  requester: {
    id: number;
    nickname: string;
  };
  topicTitle: string;
  requesterResponsePreview: RequesterResponsePreview;
  createdAt: string;
}

interface ReceivedRequestsCardProps {
  item: ReceivedRequestItem;
  onPressPreview: () => void;
}

const THEME = "#FF7D4A";

// --- Component ---
const ReceivedRequestsCard = ({
  item,
  onPressPreview,
}: ReceivedRequestsCardProps) => {
  const { requester, createdAt, topicTitle, requesterResponsePreview } = item;

  const formatPlaytime = (seconds: number | null) => {
    if (seconds === null) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View style={styles.card}>
      {/* 헤더: 아바타 + 닉네임 + 시간 */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={styles.name}>{requester?.nickname}</AppText>
          <AppText style={styles.sub}>{formatRelative(createdAt)}</AppText>
        </View>
      </View>
      {/* 👇 [변경됨] 인용문(Quote Block) 구조 수정 */}
      <TouchableOpacity style={styles.quoteBlock} onPress={onPressPreview}>
        {/* 텍스트 컨텐츠를 담을 View */}
        <View style={styles.quoteContentWrapper}>
          <AppText style={styles.questionText}>
            <AppText style={styles.questionHighlight}>Q. </AppText>
            {topicTitle}
          </AppText>
          {requesterResponsePreview.type === "TEXT" ? (
            <View style={styles.previewRow}>
              <Ionicons
                name="book-sharp"
                size={24}
                color="#6A839A"
                style={styles.previewIcon} //
              />
              <AppText style={styles.previewText} numberOfLines={2}>
                "{requesterResponsePreview.contentPreview}"
              </AppText>
            </View>
          ) : (
            <View style={styles.previewRow}>
              <AppText style={styles.previewIcon}>▶</AppText>
              <AppText style={styles.previewText}>음성 답변</AppText>
              <AppText style={styles.playtimeText}>
                {formatPlaytime(requesterResponsePreview.playtime)}
              </AppText>
            </View>
          )}
        </View>
        {/* 오른쪽 셰브론 아이콘 추가 */}
        <Ionicons name="chevron-forward" size={20} color="#5C4B44" />
      </TouchableOpacity>
      <AppText style={styles.captionText}>
        {requester?.nickname}님이 남긴 이야기를 보시고 결정해 보세요!
      </AppText>
    </View>
  );
};

export default ReceivedRequestsCard;

// --- Styles ---
const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E8EC",
    padding: 16,
    backgroundColor: "#fff",
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 4, height: 4 },
    elevation: 4,
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: THEME,
    fontWeight: "800",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5C4B44",
  },
  sub: {
    fontSize: 12,
    color: "#B0A6A0",
    marginTop: 4,
  },
  // 👇 [변경됨] quoteBlock 스타일 수정
  quoteBlock: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  // 👇 [추가됨] 텍스트 영역을 감싸는 래퍼
  quoteContentWrapper: {
    flex: 1, // 셰브론 아이콘을 제외한 나머지 공간을 모두 차지
    gap: 8,
  },

  questionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5C4B44", // topicTitle 색상
    marginBottom: 4,
  },
  // 👇 [추가됨] 'Q.' 부분에만 적용될 강조 스타일
  questionHighlight: {
    color: THEME, // 강조 색상
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewIcon: {
    fontSize: 16,
  },
  previewText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 20,
  },
  playtimeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  captionText: {
    fontSize: 12,
    color: "#5C4B44",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
