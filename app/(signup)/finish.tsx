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
import { useAuthStore } from "@/utils/store/useAuthStore";
import AppText from "@/components/common/AppText";
import { getAgeFromBirthdate } from "@/utils/util/birthdate";
import SignupHeader from "@/components/signup/SignupHeader";

const FinishPage = () => {
  const router = useRouter();
  // 한글 주석: 요약에 표시할 사인업 드래프트 구독
  const draft = useSignupDraftStore((s) => s.draft);
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const signupToken = useSignupTokenStore.getState().signupToken;
  const { showAlert } = useAlert();
  const [loading, setLoading] = React.useState(false);

  // 한글 주석: 쿼리 호출 없이 draft만 사용
  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 한글 주석: 서버로는 title/interestNames를 보내지 않도록 정규화
      const sanitizedAnswers = (draft.answers || []).map((a) => ({
        questionId: a.questionId,
        content: a.content,
        isPrimary: a.isPrimary,
      }));
      const body: SignupSumbitBody = {
        signupToken,
        nickname: draft.nickname,
        gender: draft.gender as any,
        birthdate: draft.birthdate,
        answers: sanitizedAnswers,
        interestIds: draft.interestIds || [],
        location: draft.location ?? null,
        authProvider: draft.authProvider ?? null,
        providerId: draft.providerId ?? null,
      };
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
      scrollable
      topPadding={0}
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={loading}
          onPress={handlePress}
        />
      }
    >
      <View style={styles.container}>
        {/* 헤더/베이직 정보 */}
        <View style={{ gap: 8, paddingHorizontal: 10, paddingTop: 8 }}>
          <SignupHeader
            title={`${draft.nickname}님의 정보를 확인하세요`}
            subtitle="예상 프로필을 미리 보여드려요!"
          />
          <AppText style={styles.brand}>SORAM</AppText>
          <AppText style={styles.caption}>같은 생각으로 연결된 우리</AppText>
          <AppText style={styles.name}>{draft.nickname || "-"}</AppText>
          <AppText style={styles.meta}>
            {formatBirthAndAge(draft.birthdate)}
          </AppText>
          <AppText style={styles.meta}>{draft.location || "미설정"}</AppText>
        </View>

        {/* 스토리 섹션들 */}
        {(() => {
          const answers = draft.answers || [];
          const requiredTwo = answers.slice(0, 2);
          const optional = answers.length > 2 ? answers[2] : undefined;
          const optionalTitle = useSignupDraftStore.getState().optionalTitle;

          return (
            <>
              {requiredTwo[0] ? (
                <View style={styles.section}>
                  <AppText style={styles.sectionTitle}>
                    {requiredTwo[0].title || "질문 1"}
                  </AppText>
                  <View style={styles.answerCard}>
                    <AppText style={styles.answer}>
                      {requiredTwo[0].content || "-"}
                    </AppText>
                  </View>
                </View>
              ) : null}
              {requiredTwo[1] ? (
                <View style={styles.section}>
                  <AppText style={styles.sectionTitle}>
                    {requiredTwo[1].title || "질문 2"}
                  </AppText>
                  <View style={styles.answerCard}>
                    <AppText style={styles.answer}>
                      {requiredTwo[1].content || "-"}
                    </AppText>
                  </View>
                </View>
              ) : null}
              {optional?.content?.trim() ? (
                <View style={styles.section}>
                  <AppText style={styles.sectionTitle}>
                    {optionalTitle || optional.title || "선택 질문"}
                  </AppText>
                  <View style={styles.answerCard}>
                    <AppText style={styles.answer}>
                      {optional.content.trim()}
                    </AppText>
                  </View>
                </View>
              ) : null}
            </>
          );
        })()}

        {/* 관심사 태그 */}
        <View style={[styles.section, { paddingBottom: 8 }]}>
          <AppText style={styles.sectionTitle}>관심있는 주제</AppText>
          <View style={styles.tagsRow}>
            {(draft.interestNames || []).map((name: any) => (
              <AppText
                key={String(name)}
                style={styles.tag}
              >{`#${name}`}</AppText>
            ))}
          </View>
        </View>
      </View>
    </ScreenWithStickyAction>
  );
};

export default FinishPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  brand: { color: "#FF7D4A", fontWeight: "bold", fontSize: 18 },
  caption: { color: "#9CA3AF", fontSize: 12 },
  name: { fontSize: 26, fontWeight: "bold", color: "#111827", marginTop: 8 },
  meta: { fontSize: 16, color: "#111827" },
  section: { paddingHorizontal: 10, paddingTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 8,
  },
  answerCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
  },
  answer: { color: "#374151", lineHeight: 22, fontSize: 15 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 6 },
  tag: { color: "#6B7280" },
});

// 한글 주석: 생년 + 만 나이 포맷팅
function formatBirthAndAge(birthdate?: string | null) {
  if (!birthdate) return "-";
  const age = getAgeFromBirthdate(birthdate);
  try {
    const [y] = birthdate.split("-");
    return age !== undefined ? `${y}년생, 만 ${age}세` : `${y}년생`;
  } catch {
    return birthdate as string;
  }
}
