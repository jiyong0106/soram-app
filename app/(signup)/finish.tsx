import { View, StyleSheet } from "react-native";
import React from "react";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { useSignupTokenStore } from "@/utils/store/useSignupTokenStore";
import { SignupSumbitBody } from "@/utils/types/signup";
import { postSignupSumbit } from "@/utils/api/signupPageApi";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import useAlert from "@/utils/hooks/useAlert";
import AppText from "@/components/common/AppText";
import { useAuthStore } from "@/utils/store/useAuthStore";
import SummaryCard from "@/components/signup/SummaryCard";
import InfoRow from "@/components/signup/InfoRow";
import AnswerBox from "@/components/signup/AnswerBox";

const FinishPage = () => {
  const router = useRouter();
  // 한글 주석: 요약에 표시할 사인업 드래프트 구독
  const draft = useSignupDraftStore((s) => s.draft);
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const signupToken = useSignupTokenStore.getState().signupToken;
  const { showAlert } = useAlert();
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const body: SignupSumbitBody = { signupToken, ...draft };
      const res = await postSignupSumbit(body);

      if (!res?.accessToken) {
        showAlert(" 다시 시도해 주세요.");
        return;
      }

      // 3) 토큰 저장 → 인터셉터가 이후 요청부터 자동 주입
      useAuthStore.getState().setToken(res.accessToken);

      // 4) 임시 스토어 정리
      useSignupDraftStore.getState().reset?.();
      clearSignupToken();

      // 5) 페이지 이동
      router.replace("/(tabs)/topic");
    } catch (e: any) {
      if (e) {
        showAlert(e.response.data.message);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={loading}
          style={styles.button}
          onPress={handlePress}
        />
      }
    >
      <View style={styles.container}>
        <AppText style={styles.title}>입력한 정보를 확인하세요</AppText>

        {/* 기본 정보 카드 */}
        <SummaryCard title="기본 정보">
          <InfoRow
            icon="person-outline"
            label="닉네임"
            value={draft.nickname || "-"}
          />
          <InfoRow
            icon={draft.gender === "FEMALE" ? "woman-outline" : "man-outline"}
            label="성별"
            value={formatGender(draft.gender as any)}
          />
          <InfoRow
            icon="calendar-outline"
            label="생년월일"
            value={formatBirthdate(draft.birthdate)}
          />
          <InfoRow
            icon="location-outline"
            label="지역"
            value={draft.location || "미설정"}
            dimWhenEmpty
          />
        </SummaryCard>

        {/* 프로필 답변 카드 */}
        <SummaryCard title="프로필 답변">
          <AnswerBox
            title="대표 답변"
            icon="chatbubble-ellipses-outline"
            content={getAnswerContent(draft.answers, 1)}
          />
          <AnswerBox
            title="추가 답변"
            icon="chatbubble-outline"
            content={getAnswerContent(draft.answers, 2)}
            placeholder="작성하지 않았습니다"
          />
        </SummaryCard>
      </View>
    </ScreenWithStickyAction>
  );
};

export default FinishPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },
  // 카드/행 스타일은 분리 컴포넌트 내부로 이동
});

// =====================
// 유틸 함수들

function formatGender(gender: string): string {
  if (gender === "MALE") return "남성";
  if (gender === "FEMALE") return "여성";
  return "-";
}

function formatBirthdate(s: string | undefined | null): string {
  if (!s) return "-";
  // 기대 포맷: YYYY-MM-DD
  const parts = s.split("-");
  if (parts.length !== 3) return s;
  const [y, m, d] = parts;
  return `${y}.${m}.${d}`;
}

function getAnswerContent(
  answers: Array<{ questionId: number; content: string }> | undefined,
  id: number
): string {
  const content = answers?.find((a) => a.questionId === id)?.content?.trim();
  return content || "";
}
