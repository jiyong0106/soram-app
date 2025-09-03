import React, { ForwardedRef, forwardRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "../common/AppText";
import { useLocalSearchParams, useRouter } from "expo-router";

interface TopicListSheetProps {
  snapPoints?: ReadonlyArray<string | number>;
  title: string;
  id: number;
}
const THEME = "#ff6b6b";
const BTN_MIN_HEIGHT = 64; // ✅ 두 버튼 최소 높이 통일

const TopicListSheet = (
  { snapPoints, title, id }: TopicListSheetProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const router = useRouter();
  const dismiss = () => (ref as any)?.current?.dismiss?.();

  const handleSeeOthers = () => {
    dismiss();
    // …네비게이션 등
  };

  // const handleWriteAnswer = () => {
  //   dismiss();
  //   router.push({
  //     pathname: "/topic/list/[listId]",
  //     params: {
  //       listId: id,
  //       title,
  //     },
  //   });
  //   // …네비게이션 등
  // };

  const handleWriteAnswer = () => {
    dismiss(); // 시트 닫기(애니메이션 시작)
    InteractionManager.runAfterInteractions(() => {
      router.push({
        pathname: "/topic/list/[listId]",
        params: { listId: String(id), title },
      });
    });
  };

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={styles.container}>
        {/* 타이틀 */}
        <View style={styles.titleRow}>
          <AppText style={styles.q}>Q. </AppText>
          <AppText style={styles.title}>{title}</AppText>
        </View>

        {/* 1) 꽉 찬 테마 버튼 */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.ctaBase, styles.ctaPrimary]}
          onPress={handleSeeOthers}
          accessibilityRole="button"
          accessibilityLabel="다른 사람의 답변 보러가기"
        >
          <View style={{ flexShrink: 1 }}>
            <AppText style={styles.ctaPrimaryText}>
              다른 사람의 답변 보러가기
            </AppText>
            <AppText style={styles.ctaPrimarySub}>마음 탐색권 1개 사용</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* 2) 아웃라인 버튼 */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.ctaBase, styles.ctaGhost]}
          onPress={handleWriteAnswer}
          accessibilityRole="button"
          accessibilityLabel="내 답변 남기기"
        >
          <AppText style={styles.ctaGhostText}>내 답변 남기기</AppText>
          <Ionicons name="chevron-forward" size={20} color={THEME} />
        </TouchableOpacity>
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(TopicListSheet);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  q: { color: THEME, fontWeight: "800", fontSize: 18 },
  title: {
    fontSize: 18,
    lineHeight: 26,
    color: "#3a3a3a",
    fontWeight: "700",
    flexShrink: 1,
  },

  /** 공통 버튼 베이스 — 여기서 폭/높이 통일 */
  ctaBase: {
    alignSelf: "stretch", // ✅ 부모가 center여도 가로 꽉 채움
    width: "100%", // ✅ 안전장치
    minHeight: BTN_MIN_HEIGHT, // ✅ 높이 통일(필요하면 height로 고정도 가능)
    borderRadius: 16,
    paddingHorizontal: 16,
    // 세로 padding 대신 minHeight+center로 정렬 → 줄 수 달라도 높이 동일
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  ctaPrimary: {
    backgroundColor: THEME,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  ctaPrimaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  ctaPrimarySub: { color: "#fff", opacity: 0.95, marginTop: 4, fontSize: 12 },

  ctaGhost: {
    borderWidth: 1.5,
    borderColor: THEME,
    backgroundColor: "#fff",
  },
  ctaGhostText: { color: THEME, fontSize: 16, fontWeight: "700" },
});
