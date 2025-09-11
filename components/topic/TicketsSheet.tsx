import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "../common/AppText";
import ScalePressable from "../common/ScalePressable";
import { useTicketsStore } from "@/utils/store/useTicketsStore";

interface TicketsSheetProps {
  snapPoints?: ReadonlyArray<string | number>;
}

type TicketItem = {
  code: "C" | "N" | "M";
  title: string;
  desc: string;
  color: string; // badge color
  value: number;
};

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <AppText style={styles.badgeText}>{label}</AppText>
  </View>
);

const Row = ({ item }: { item: TicketItem }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Badge label={item.code} color={item.color} />
      <AppText style={styles.rowTitle}>
        {item.title} - {item.value}개
      </AppText>
    </View>
    <AppText style={styles.rowDesc}>{item.desc}</AppText>
  </View>
);

const TicketsSheet = (
  { snapPoints }: TicketsSheetProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const dismiss = () => (ref as any)?.current?.dismiss?.();

  const { CHAT, VIEW_RESPONSE } = useTicketsStore((s) => s.counts);

  const items: TicketItem[] = [
    {
      code: "C",
      title: "대화요청권",
      desc: "마음에 드는 상대방에게 대화를 요청할 수 있어요",
      color: "#FF8A5B",
      value: CHAT ?? 0,
    },
    {
      code: "M",
      title: "답변 보기",
      desc: "상대방이 남긴 답변을 볼 수 있어요",
      color: "#BFDCAB",
      value: VIEW_RESPONSE ?? 0,
    },
  ];

  const handlePurchase = () => {
    dismiss();
    // TODO: 구매 화면으로 이동
    // router.push("/tickets/purchase");
  };

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={styles.container}>
        {/* 제목 */}
        <AppText style={styles.header}>현재 보유중인 사용권</AppText>

        {/* 리스트 */}
        <View style={styles.listCard}>
          {items.map((it, i) => (
            <View key={it.code}>
              <Row item={it} />
              {i < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* CTA */}
        {/* <ScalePressable style={styles.cta} onPress={handlePurchase}>
          <AppText style={styles.ctaText}>사용권 구매하러 </AppText>
          <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
        </ScalePressable> */}
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
});
