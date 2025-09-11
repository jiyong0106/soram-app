// 받은 연결 요청 카드 - 요청자 정보, 상태 배지, 수락/거절 버튼 제공
import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import Button from "../common/Button";
import { GetConnectionsType } from "@/utils/types/connection";
import { formatRelative } from "@/utils/util/formatRelative";
import {
  getInitials,
  hexWithAlpha,
  connectionStatusLabel as statusLabel,
} from "@/utils/util/uiHelpers";

// 부모에서 비동기 처리(onAccept/onReject)를 주입
interface ReceivedRequestsCardProps {
  item: GetConnectionsType;
  onAccept: () => void;
  onReject: () => void;
  disabled?: boolean;
}

const THEME = "#ff6b6b";

const ReceivedRequestsCard = ({
  item,
  onAccept,
  onReject,
  disabled,
}: ReceivedRequestsCardProps) => {
  const { id, requesterId, addresseeId, status, requester, createdAt } = item;

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
          <AppText style={styles.avatarText}>
            {getInitials(requester?.nickname)}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={styles.name}>{requester?.nickname}</AppText>
          <AppText style={styles.sub}>
            {formatRelative(createdAt)} • ID {requesterId}
          </AppText>
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

      {/* 메타 블록: 내부 식별자 안내 */}
      <View style={styles.metaBlock}>
        <AppText style={styles.meta}>요청 ID: {id}</AppText>
        <AppText style={styles.meta}>내 ID: {addresseeId}</AppText>
      </View>

      {/* 액션: 대기 상태에서만 활성화 */}
      <View style={styles.btnRow}>
        <View style={styles.rejWrap}>
          <Button
            label="거절"
            color="#fff"
            textColor={THEME}
            style={[styles.btn, styles.ghost]}
            onPress={onReject}
            disabled={disabled || status !== "PENDING"}
          />
        </View>
        <View style={styles.acceptWrap}>
          <Button
            label="수락"
            color={THEME}
            textColor="#fff"
            style={styles.btn}
            onPress={onAccept}
            disabled={disabled || status !== "PENDING"}
          />
        </View>
      </View>
    </View>
  );
};

export default ReceivedRequestsCard;

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
    backgroundColor: "#FFE2E2",
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
  metaBlock: {
    backgroundColor: "#FAFAFB",
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  meta: {
    fontSize: 12,
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
