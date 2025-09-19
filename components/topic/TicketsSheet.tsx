import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "../common/AppText";
import { useTicketsStore } from "@/utils/store/useTicketsStore";
import type { TicketBreakdownItem } from "@/utils/types/auth";

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <AppText style={styles.badgeText}>{label}</AppText>
  </View>
);

const Row = ({
  code,
  color,
  title,
  desc,
  totalQuantity,
  breakdown,
}: {
  code: string;
  color: string;
  title: string;
  desc: string;
  totalQuantity: number;
  breakdown: TicketBreakdownItem[];
}) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Badge label={code} color={color} />
      <AppText style={styles.rowTitle}>
        {title} - {totalQuantity}개
      </AppText>
    </View>
    <AppText style={styles.rowDesc}>{desc}</AppText>

    {/* 데이터 확인용 임시 UI (정상 동작 확인 후 제거 예정) */}
    <View style={styles.breakdownContainer}>
      <AppText style={styles.breakdownTitle}>[데이터 확인용 Breakdown]</AppText>
      {breakdown.map((item, index) => (
        <AppText key={index} style={styles.breakdownText}>
          - Type: {item.sourceType}, Qty: {item.quantity}, Expires:{" "}
          {item.expiresAt}
        </AppText>
      ))}
    </View>
  </View>
);

const TicketsSheet = (
  { snapPoints }: { snapPoints?: ReadonlyArray<string | number> },
  ref: ForwardedRef<BottomSheetModal>
) => {
  // 변경점 1: TicketsView와 동일하게, initialized 상태를 함께 가져옵니다.
  const data = useTicketsStore((s) => s.data);
  const initialized = useTicketsStore((s) => s.initialized);

  // 변경점 2: 데이터가 준비되지 않았다면 렌더링하지 않도록 안전장치를 추가합니다.
  if (!initialized) {
    return null;
  }

  // 이 시점부터 data는 안전하게 사용할 수 있습니다.
  const { CHAT, VIEW_RESPONSE } = data;

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={styles.container}>
        <AppText style={styles.header}>현재 보유중인 사용권</AppText>
        <View style={styles.listCard}>
          <Row
            code="C"
            color="#FF8A5B"
            title="대화요청권"
            desc="마음에 드는 상대방에게 대화를 요청할 수 있어요"
            totalQuantity={CHAT.totalQuantity}
            breakdown={CHAT.breakdown}
          />
          <View style={styles.divider} />
          <Row
            code="M"
            color="#BFDCAB"
            title="답변 보기"
            desc="상대방이 남긴 답변을 볼 수 있어요"
            totalQuantity={VIEW_RESPONSE.totalQuantity}
            breakdown={VIEW_RESPONSE.breakdown}
          />
        </View>
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(TicketsSheet);

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 14,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8E6F5A", // 살짝 톤 다운된 브라운 계열 (스샷 느낌)
    textAlign: "center",
  },
  listCard: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: "#FFF7F1", // 은은한 베이지 톤
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 6,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A4A4A",
  },
  rowDesc: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 18,
    marginLeft: 32, // 배지+여백만큼 들여쓰기
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EADDD3",
    marginHorizontal: 10,
  },
  cta: {
    marginTop: 4,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  // --- 데이터 확인용 임시 스타일 ---
  breakdownContainer: {
    marginTop: 8,
    marginLeft: 32,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  breakdownText: {
    fontSize: 11,
    color: "#555",
  },
});
