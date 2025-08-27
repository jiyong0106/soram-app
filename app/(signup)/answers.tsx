import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { StyleSheet, TextInput, View } from "react-native";
import { useSignupDraftStore } from "@/utils/sotre/useSignupDraftStore"; // (오탈자면 store로 수정)
import { useMemo, useState } from "react";
import AppText from "@/components/common/AppText";

const MAX_LEN = 1000;

const AnswersPage = () => {
  const router = useRouter();
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const answers = useSignupDraftStore((s) => s.draft.answers);
  const patch = useSignupDraftStore((s) => s.patch);
  const [focused, setFocused] = useState(false);

  //  대표 답변(고정: questionId=1, isPrimary=true)을 선택
  const primary = useMemo(
    () => answers?.find((a) => a.isPrimary) ?? { content: "" },
    [answers]
  );

  // content 변경 핸들러 (answers 배열의 해당 항목만 업데이트)
  const onChangePrimaryContent = (t: string) => {
    const content = Array.from(t).slice(0, MAX_LEN).join("");
    patch({
      answers: (
        answers ?? [{ questionId: 1, isPrimary: true, content: "" }]
      ).map((a) => (a.isPrimary ? { ...a, content } : a)),
    });
  };

  const disabled = !(primary?.content ?? "").trim();

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          disabled={disabled}
          style={styles.button}
          onPress={() => router.push("/(signup)/finish")}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <AppText style={styles.title}>{nickname}님의 필수 정보 입력</AppText>
          <AppText style={styles.subtitle}>
            자기소개를 작성해주세요 (최대 {MAX_LEN}자)
          </AppText>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="예) 저는 사람들과 대화를 좋아하고 주말에는 등산을 즐겨요..."
            value={primary?.content ?? ""}
            onChangeText={onChangePrimaryContent}
            maxLength={MAX_LEN}
            returnKeyType="default"
            autoCapitalize="sentences"
            autoCorrect
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <AppText style={styles.counter}>
            {primary?.content?.length ?? 0}/{MAX_LEN}
          </AppText>
        </View>
      </View>
    </ScreenWithStickyAction>
  );
};

export default AnswersPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { marginTop: 32 },
  headerTitle: { marginBottom: 30, gap: 10, marginTop: 15 },
  title: { fontSize: 20, fontWeight: "600", color: "#222" },
  subtitle: { fontSize: 15, color: "#666666" },
  inputWrap: { position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#F1C0B5",
    borderRadius: 10,
    minHeight: 200,
    padding: 10,
    backgroundColor: "#FFF",
    fontSize: 14,
    textAlignVertical: "top",
  },
  inputFocused: { borderColor: "#ff6b6b" },
  counter: {
    position: "absolute",
    right: 10,
    bottom: -18,
    fontSize: 12,
    color: "#999",
  },
});
