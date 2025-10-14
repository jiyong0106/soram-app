// 보낸 연결 요청 카드 - 상대 정보, 상태 배지, 취소 버튼 제공
import { StyleSheet, View } from "react-native";
import React from "react";
import { GetSentConnectionsType } from "@/utils/types/connection";
import AppText from "../common/AppText";
import { formatRelative } from "@/utils/util/formatRelative";
import Button from "../common/Button";
import {
  getInitials,
  hexWithAlpha,
  connectionStatusLabel as statusLabel,
} from "@/utils/util/uiHelpers";
import { Ionicons } from "@expo/vector-icons";

// 부모가 비동기 취소 핸들러 등을 주입할 수 있도록 설계
interface SentRequestsCardProps {
  item: GetSentConnectionsType;
  disabled?: boolean;
  onCancel: () => void;
}
const THEME = "#FF6B3E";

const SentRequestsCard = ({
  item,
  disabled,
  onCancel,
}: SentRequestsCardProps) => {
  const { id, requesterId, addresseeId, status, addressee, createdAt } = item;
  // 상태별 표시 색상
  const statusColor =
    status === "PENDING"
      ? "#F59E0B"
      : status === "ACCEPTED"
      ? "#10B981"
      : "#EF4444";

  return (
    <View style={styles.card}>
      {/* 헤더: 아바타 + 닉네임 + 상태 배지 */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText style={styles.name}>{addressee?.nickname}</AppText>
          <AppText style={styles.sub}>{formatRelative(createdAt)}</AppText>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: hexWithAlpha(statusColor, 0.12),
              borderColor: statusColor,
            },
          ]}
        >
          <AppText style={[styles.badgeText, { color: statusColor }]}>
            {statusLabel(status)}
          </AppText>
        </View>
      </View>

      {/* 액션: 대기 상태에서만 취소 가능 */}
      <View style={styles.btnRow}>
        <View style={styles.rejWrap}>
          <Button
            label="요청 취소"
            color="#fff"
            textColor={THEME}
            style={[styles.btn, styles.ghost]}
            onPress={onCancel}
            disabled={disabled || status !== "PENDING"}
          />
        </View>
      </View>
    </View>
  );
};

export default SentRequestsCard;

/* helpers moved to @/utils/util/uiHelpers */

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E8EC",
    padding: 10,
    backgroundColor: "#fff",
    gap: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // Android
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
    color: "#1F2937",
  },
  sub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
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
    borderWidth: 1.5,
    borderColor: THEME,
  },
  acceptWrap: {
    flex: 1,
  },
  rejWrap: {
    flex: 1,
  },
});
