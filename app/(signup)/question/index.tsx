import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { useMemo, useRef } from "react";
import AppText from "@/components/common/AppText";
import QuestionPageSheet from "@/components/signup/QuestionPageSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RequiredQuestionItem from "@/components/signup/RequiredQuestionItem";
import OptionalQuestionItem from "@/components/signup/OptionalQuestionItem";

const QuestionPage = () => {
  const router = useRouter();
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const answers = useSignupDraftStore((s) => s.draft.answers);

  const sheetRef = useRef<BottomSheetModal>(null);

  const disabled = useMemo(() => {
    const a1 = answers?.find((a) => a.questionId === 1)?.content?.trim();
    const a2 = answers?.find((a) => a.questionId === 2)?.content?.trim();
    return !(a1 && a1.length > 0 && a2 && a2.length > 0);
  }, [answers]);

  const openSheet = () => {
    sheetRef.current?.present?.();
  };

  // 한글 주석: 계속하기 시 최종 보정 및 이동
  const handleContinue = () => {
    // 필수 질문 완료 여부는 disabled로도 제어됨
    const store = useSignupDraftStore.getState();
    const optional = store.draft.answers.find(
      (a) => a.questionId !== 1 && a.questionId !== 2
    );
    if (optional && !optional.content.trim()) {
      // 한글 주석: 빈 선택 답변은 제출에서 제외
      store.removeAnswer?.(optional.questionId);
    }
    router.push("/(signup)/finish");
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerTitle}>
          <AppText style={styles.title}>{nickname}님의 필수 정보 입력</AppText>
          <AppText style={styles.subtitle}>
            나를 소개하는 글을 작성해주세요
          </AppText>
        </View>

        <View style={styles.inputWrap}>
          <RequiredQuestionItem
            questionId={1}
            label="1. 인생의 목표는 무엇인가요?"
          />
          <RequiredQuestionItem
            questionId={2}
            label="2. 이런 사람에게 호감을 느껴요"
          />
          <OptionalQuestionItem
            label="질문을 선택해 주세요"
            onOpenPicker={openSheet}
          />
        </View>
      </View>
      <Button
        label="계속하기"
        color="#FF7D4A"
        textColor="#fff"
        disabled={disabled}
        style={styles.button}
        onPress={handleContinue}
      />
      <QuestionPageSheet ref={sheetRef} snapPoints={["90%"]} />
    </View>
  );
};

export default QuestionPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  button: {
    marginBottom: 20,
  },
  headerTitle: {
    marginBottom: 30,
    gap: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
  },
  inputWrap: {
    gap: 10,
  },
});
