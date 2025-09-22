// app/components/connection/ReceivedRequestsCard.tsx

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../common/AppText";
import Button from "../common/Button";
import { formatRelative } from "@/utils/util/formatRelative";
import { getInitials } from "@/utils/util/uiHelpers";

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

// 3. 컴포넌트 Props 타입
interface ReceivedRequestsCardProps {
  item: ReceivedRequestItem;
  onAccept: () => void;
  onReject: () => void;
  onPressPreview: () => void; // 답변 미리보기 영역 터치 이벤트
  disabled?: boolean;
}

const THEME = "#FF7D4A";

// --- Component ---
const ReceivedRequestsCard = ({
  item,
  onAccept,
  onReject,
  onPressPreview,
  disabled,
}: ReceivedRequestsCardProps) => {
  const { requester, createdAt, topicTitle, requesterResponsePreview } = item;

  // playtime(초)을 "M:SS" 형식의 문자열로 변환하는 함수
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
          <AppText style={styles.avatarText}>
            {getInitials(requester?.nickname)}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={styles.name}>{requester?.nickname}</AppText>
          <AppText style={styles.sub}>
            {formatRelative(createdAt)} • ID {requester.id}
          </AppText>
        </View>
      </View>

      {/* 👇 [변경됨] 인용문(Quote Block) 형태의 답변 미리보기 */}
      <TouchableOpacity
        style={styles.quoteBlock}
        onPress={onPressPreview}
        disabled={disabled}
      >
        <AppText style={styles.questionText}>Q. {topicTitle}</AppText>

        {/* 답변 유형에 따라 다른 UI 렌더링 */}
        {requesterResponsePreview.type === "TEXT" ? (
          // 텍스트 답변
          <View style={styles.previewRow}>
            <AppText style={styles.previewIcon}>💬</AppText>
            <AppText style={styles.previewText} numberOfLines={2}>
              "{requesterResponsePreview.contentPreview}"
            </AppText>
          </View>
        ) : (
          // 음성 답변
          <View style={styles.previewRow}>
            <AppText style={styles.previewIcon}>▶</AppText>
            <AppText style={styles.previewText}>음성 답변</AppText>
            <AppText style={styles.playtimeText}>
              {formatPlaytime(requesterResponsePreview.playtime)}
            </AppText>
          </View>
        )}
      </TouchableOpacity>

      {/* 액션 버튼 */}
      <View style={styles.btnRow}>
        <View style={styles.btnWrap}>
          <Button
            label="거절"
            color="#fff"
            textColor={THEME}
            style={[styles.btn, styles.ghost]}
            onPress={onReject}
            disabled={disabled}
          />
        </View>
        <View style={styles.btnWrap}>
          <Button
            label="수락"
            color={THEME}
            textColor="#fff"
            style={styles.btn}
            onPress={onAccept}
            disabled={disabled}
          />
        </View>
      </View>
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
    padding: 16, // 패딩 조정
    backgroundColor: "#fff",
    gap: 16, // 간격 조정
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    backgroundColor: "#FFF3EC",
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
    color: "#1F2937",
  },
  sub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  // 👇 [변경됨] 기존 metaBlock -> quoteBlock
  quoteBlock: {
    backgroundColor: "#F9FAFB", // 약간 더 밝은 회색
    borderRadius: 12,
    padding: 14,
    gap: 8, // 내부 간격
  },
  // 👇 [추가됨] 질문 텍스트 스타일
  questionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 4,
  },
  // 👇 [추가됨] 미리보기 영역 행 스타일
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // 👇 [추가됨] 미리보기 아이콘 스타일
  previewIcon: {
    fontSize: 16,
  },
  // 👇 [추가됨] 미리보기 텍스트 스타일
  previewText: {
    flex: 1, // 텍스트가 길어지면 줄바꿈 되도록
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  // 👇 [추가됨] 음성 재생시간 스타일
  playtimeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    minHeight: 44,
    borderRadius: 12,
  },
  ghost: {
    borderWidth: 1.5, // 테두리 강조
    borderColor: THEME,
  },
  btnWrap: {
    flex: 1,
  },
});
