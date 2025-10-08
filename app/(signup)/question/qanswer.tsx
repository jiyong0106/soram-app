import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import Button from "@/components/common/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import PageContainer from "@/components/common/PageContainer";
import SignupQuestionHeader from "@/components/signup/SignupQuestionHeader";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import useSafeArea from "@/utils/hooks/useSafeArea";
import ProgressFooter from "@/components/topic/ProgressFooter";
import { Stack } from "expo-router";
import { BackButton } from "@/components/common/backbutton";

const MAX_LEN = 1000;

const QanswerPage = () => {
  const router = useRouter();
  const {
    label,
    variant,
    questionId,
    subQuestions: rawSubQuestions,
  } = useLocalSearchParams();

  const title = String(label || "");
  const subQuestions = rawSubQuestions
    ? JSON.parse(String(rawSubQuestions))
    : [];
  const qid = Number(questionId ?? 1);

  const getAnswerById = useSignupDraftStore((s) => s.getAnswerById);
  const upsertAnswer = useSignupDraftStore((s) => s.upsertAnswer);
  const [text, setText] = useState("");
  const { bottom } = useSafeArea();

  useEffect(() => {
    const existing = getAnswerById?.(qid)?.content ?? "";
    setText(existing);
  }, [qid, getAnswerById]);

  const isOver = text.length > MAX_LEN;
  const isValid = text.trim().length > 0 && !isOver;

  const onNext = () => {
    if (!isValid) return;
    const isPrimary = variant === "required" && (qid === 1 || qid === 2);
    upsertAnswer?.({
      questionId: qid,
      title: String(label || ""),
      content: text,
      isPrimary,
    });
    router.back();
  };

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: "답변하기",
          headerLeft: () => <BackButton />,
        }}
      />
      <ScrollView
        style={{ backgroundColor: "#fff" }}
        keyboardDismissMode="interactive"
        contentContainerStyle={{ padding: 10 }}
        automaticallyAdjustKeyboardInsets
      >
        <SignupQuestionHeader title={title} subQuestions={subQuestions} />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="부적절하거나 불쾌감을 줄 수 있는 콘텐츠는 제재될 수 있습니다"
          placeholderTextColor="#B0A6A0"
          style={styles.textarea}
          multiline
          textAlignVertical="top"
          maxLength={MAX_LEN}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </ScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: bottom }}>
        <View style={styles.footer}>
          <ProgressFooter length={text.length} max={MAX_LEN} />
          <Button
            label="완료"
            color="#FF7D4A"
            textColor="#fff"
            disabled={!isValid}
            onPress={onNext}
          />
        </View>
      </KeyboardStickyView>
    </PageContainer>
  );
};

export default QanswerPage;

const styles = StyleSheet.create({
  textarea: {
    minHeight: 200,
    fontSize: 16,
    textAlignVertical: "top",
    padding: 10,
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
