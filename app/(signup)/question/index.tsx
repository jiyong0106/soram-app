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
import { useQuery } from "@tanstack/react-query";

const QuestionPage = () => {
  const router = useRouter();
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const sheetRef = useRef<BottomSheetModal>(null);

  const { data = [] } = useQuery({
    queryKey: ["requiredQuestionsKey"],
    queryFn: getProfileQuestions,
  });

  const openSheet = () => {
    sheetRef.current?.present?.();
  };

  // 한글 주석: 앞 2개만 필수로 간주하고 모두 답변했는지 확인
  const requiredIds = useMemo(() => data.slice(0, 2).map((q) => q.id), [data]);
  const disabled = useSignupDraftStore((s) =>
    requiredIds.length < 2
      ? true
      : !requiredIds.every(
          (rid) =>
            !!s.draft.answers.find((a) => a.questionId === rid)?.content?.trim()
        )
  );

  return (
    <View style={styles.container}>
      <View>
        <SignupHeader
          title={`${nickname}님의 질문을 선택해 주세요`}
          subtitle="나를 소개하는 글을 작성해주세요"
        />

        <View style={styles.inputWrap}>
          {data.slice(0, 2).map((item) => (
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
        onPress={() => router.push("/(signup)/interests")}
      />
      <QuestionPageSheet ref={sheetRef} snapPoints={["90%"]} questions={data} />
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
