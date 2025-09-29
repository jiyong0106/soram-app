import React, { ForwardedRef, forwardRef, useMemo, useState } from "react";
import { View, StyleSheet, InteractionManager, FlatList } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import SheetRow from "@/components/common/SheetRow";
import { useRouter } from "expo-router";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import QuestionCategoryTabs from "@/components/signup/QuestionCategoryTabs";
import { CATEGORY_DEF, QUESTIONS } from "@/utils/dummy/test";

interface Props {
  snapPoints?: ReadonlyArray<string | number>;
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#111827", // gray-900
  sub: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  fill: "#F9FAFB", // gray-50
  danger: "#EF4444", // red-500
  icon: "#111827",
};

// 한글 주석: 카테고리/질문 더미 데이터(추후 API 연동 시 교체)

const QuestionPageSheet = (
  { snapPoints }: Props,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const [navigateNext, setNavigateNext] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    CATEGORY_DEF[0]?.id ?? ""
  );
  const visibleQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.categoryId === selectedCategoryId),
    [selectedCategoryId]
  );

  const router = useRouter();
  const dismiss = () => (ref as any)?.current?.dismiss?.();
  const setOptionalTitle = useSignupDraftStore((s) => s.setOptionalTitle);

  const onPress = (title: string) => {
    // 한글 주석: 선택된 질문의 타이틀을 저장한 뒤 시트 닫기
    setOptionalTitle?.(title);
    setSelectedTitle(title);
    setNavigateNext(true);
    dismiss();
  };

  return (
    <AppBottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={() => {
        if (navigateNext) {
          setNavigateNext(false);
          InteractionManager.runAfterInteractions(() => {
            router.push({
              pathname: "/(signup)/question/qanswer",
              params: {
                variant: "optional",
                label: selectedTitle,
                questionId: 3, // 한글 주석: 선택 질문은 3으로 고정(요구사항)
              },
            });
          });
        }
      }}
    >
      <View style={s.container}>
        {/* 한글 주석: 카테고리 탭 */}
        <QuestionCategoryTabs
          categories={CATEGORY_DEF}
          selectedId={selectedCategoryId}
          onChange={setSelectedCategoryId}
        />

        {/* 한글 주석: 질문 리스트 */}
        <View style={s.group}>
          <FlatList
            data={visibleQuestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SheetRow
                icon={
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={COLORS.icon}
                  />
                }
                label={item.title}
                onPress={() => onPress(item.title)}
              />
            )}
            ItemSeparatorComponent={() => <View style={s.divider} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(QuestionPageSheet);

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  header: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 12,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.sub,
  },
  group: {
    backgroundColor: COLORS.fill,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginTop: 12,
    maxHeight: "80%",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginLeft: 36, // 아이콘 영역만큼 들여 써서 라인이 깔끔하게 보이도록
  },
});
