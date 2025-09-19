import React, { ForwardedRef, forwardRef, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "../common/AppText";
import { useTicketsStore } from "@/utils/store/useTicketsStore";
import type { TicketBreakdownItem, TicketSourceType } from "@/utils/types/auth";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";

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
}) => {
  const processedBreakdown = useMemo(() => {
    const dailyTicket = breakdown.find((item) => item.sourceType === "DAILY");
    const storedTickets = breakdown.filter(
      (item) => item.sourceType !== "DAILY"
    );
    const getExpiresText = (expiresAt: string) => {
      const diff = dayjs(expiresAt).diff(dayjs(), "day");
      if (diff < 0) return "(기간 만료)";
      if (diff === 0) return "(오늘 사라져요)";
      return `(${diff + 1}일 뒤에 사라져요)`;
    };
    const getSourceTypeText = (sourceType: TicketSourceType) => {
      if (sourceType === "EVENT") return "이벤트 이용권";
      if (sourceType === "PAID") return "구매한 이용권";
      return "보관 중인 이용권";
    };
    return {
      daily: dailyTicket
        ? {
            quantity: dailyTicket.quantity,
            expiresText: "(매일 오전 6시에 초기화됩니다)",
          }
        : null,
      stored: storedTickets.map((item) => ({
        quantity: item.quantity,
        text: `${getSourceTypeText(item.sourceType)}`,
        expiresText: getExpiresText(item.expiresAt),
      })),
    };
  }, [breakdown]);

  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <View style={styles.rowLeft}>
          <Badge label={code} color={color} />
          <AppText style={styles.rowTitle}>{title}</AppText>
        </View>
        <AppText style={styles.totalQuantityText}>총 {totalQuantity}개</AppText>
      </View>
      <AppText style={styles.rowDesc}>{desc}</AppText>
      <View style={styles.stackedBarPlaceholder} />
      <View style={styles.breakdownList}>
        {processedBreakdown.daily && (
          <View style={styles.breakdownItem}>
            <AppText style={[styles.breakdownText, styles.dailyText]}>
              • 오늘 사라지는 이용권 {processedBreakdown.daily.quantity}개
            </AppText>
            <AppText style={styles.expiresText}>
              {processedBreakdown.daily.expiresText}
            </AppText>
          </View>
        )}
        {processedBreakdown.stored.map((item, index) => (
          <View key={index} style={styles.breakdownItem}>
            <AppText style={styles.breakdownText}>
              • {item.text} {item.quantity}개
            </AppText>
            <AppText style={styles.expiresText}>{item.expiresText}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

// --- 변경점: 누락된 props와 ref를 다시 받도록 함수 시그니처 수정 ---
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
        {/* 변경점 2: LinearGradient 컴포넌트를 배경으로 추가 */}
        <LinearGradient
          colors={["#FFF3EC", "#FFFFFF"]}
          style={StyleSheet.absoluteFill}
        />

        <AppText style={styles.header}>보유 중인 사용권</AppText>
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
    flex: 1, // 자식 요소들을 감싸기 위해 추가
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 10,
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 10,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  totalQuantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  rowDesc: {
    fontSize: 13,
    color: "#8E8E8E",
    marginLeft: 32,
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
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 10,
  },
  stackedBarPlaceholder: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F0F0F0",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  breakdownList: {
    marginLeft: 5,
    gap: 12,
  },
  breakdownItem: {
    gap: 4,
  },
  breakdownText: {
    fontSize: 14,
    color: "#555",
  },
  dailyText: {
    fontWeight: "bold",
    color: "#333",
  },
  expiresText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 15,
  },
});
