import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "../common/AppText";
import { useRouter } from "expo-router";
import ScalePressable from "../common/ScalePressable";
import useTicketGuard from "@/utils/hooks/useTicketGuard";
import useAlert from "@/utils/hooks/useAlert";

interface TopicListSheetProps {
  snapPoints?: ReadonlyArray<string | number>;
  title: string;
  id: number;
  subQuestions: string[];
}
const THEME = "#FF7D4A";
const BTN_MIN_HEIGHT = 64; //  두 버튼 최소 높이 통일

const TopicListSheet = (
  { snapPoints, title, id }: TopicListSheetProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const router = useRouter();
  const dismiss = () => (ref as any)?.current?.dismiss?.();
  const { showAlert } = useAlert();
  const ensureNewResponse = useTicketGuard("VIEW_RESPONSE", {
    onInsufficient: () => showAlert("일일 티켓을 모두 소모했어요!"),
    optimistic: true,
  });

  //여기서
  const handleSeeOthers = () => {
    dismiss();
    ensureNewResponse.ensure(() => {
      InteractionManager.runAfterInteractions(() => {
        router.push({
          pathname: "/topic/[topicId]",
          params: { topicId: id, title },
        });
      });
    });
  };

  const handleWriteAnswer = () => {
    dismiss(); // 시트 닫기(애니메이션 시작)
    InteractionManager.runAfterInteractions(() => {
      router.push({
        pathname: "/topic/list/[listId]",
        params: { listId: String(id) },
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
        <View></View>

        {/* 1) 꽉 찬 테마 버튼 */}
        <ScalePressable
          style={[styles.ctaBase, styles.ctaPrimary]}
          onPress={handleSeeOthers}
        >
          <View style={{ flexShrink: 1 }}>
            <AppText style={styles.ctaPrimaryText}>
              다른 사람의 이야기 보러가기
            </AppText>
            <AppText style={styles.ctaPrimarySub}>
              이야기 보기권 1개 사용
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </ScalePressable>

        {/* 2) 아웃라인 버튼 */}
        <ScalePressable
          style={[styles.ctaBase, styles.ctaGhost]}
          onPress={handleWriteAnswer}
        >
          <AppText style={styles.ctaGhostText}>내 이야기 남기기</AppText>
          <Ionicons name="chevron-forward" size={20} color={THEME} />
        </ScalePressable>
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
  q: { color: THEME, fontWeight: "bold", fontSize: 18 },
  title: {
    fontSize: 18,
    lineHeight: 26,
    color: "#5C4B44",
    fontWeight: "bold",
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
  ctaPrimaryText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  ctaPrimarySub: { color: "#fff", opacity: 0.95, marginTop: 4, fontSize: 12 },

  ctaGhost: {
    borderWidth: 1,
    borderColor: THEME,
    backgroundColor: "#fff",
  },
  ctaGhostText: { color: THEME, fontSize: 14, fontWeight: "bold" },
});
