import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { useEffect, useMemo, useRef, useState } from "react";
import QuestionPageSheet from "@/components/signup/QuestionPageSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RequiredQuestionItem from "@/components/signup/RequiredQuestionItem";
import OptionalQuestionItem from "@/components/signup/OptionalQuestionItem";
import SignupHeader from "@/components/signup/SignupHeader";
import { getProfileQuestions } from "@/utils/api/signupPageApi";
import { getProfileQuestionsResponse } from "@/utils/types/signup";
// import { getItemAsync } from "expo-secure-store"; // 사용되지 않아 주석 처리

const QuestionPage = () => {
  const router = useRouter();
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const answers = useSignupDraftStore((s) => s.draft.answers);

  const sheetRef = useRef<BottomSheetModal>(null);

  // 한글 주석: 프로필 질문 API 로드
  const [questions, setQuestions] = useState<
    getProfileQuestionsResponse[] | null
  >(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProfileQuestions();
        if (mounted) setQuestions(data);
      } catch (e) {
        if (mounted) setQuestions([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  // console.log(questions); // 디버깅 로그 제거
  const requiredQuestions = useMemo(
    () =>
      (questions || [])
        .filter((q) => q.id === 1 || q.id === 2)
        .sort((a, b) => a.id - b.id),
    [questions]
  );
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
    router.push("/(signup)/interests");
  };

  return (
    <View style={styles.container}>
      <View>
        <SignupHeader
          title={`${nickname}님의 질문을 선택해 주세요`}
          subtitle="나를 소개하는 글을 작성해주세요"
        />

        <View style={styles.inputWrap}>
          {requiredQuestions.map((item) => (
            <RequiredQuestionItem key={item.id} item={item} />
          ))}
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
      <QuestionPageSheet
        ref={sheetRef}
        snapPoints={["90%"]}
        questions={(questions || []).filter((q) => q.id !== 1 && q.id !== 2)}
      />
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
  inputWrap: {
    gap: 10,
  },
});
