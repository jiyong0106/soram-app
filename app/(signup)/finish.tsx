import { View, StyleSheet, Platform } from "react-native"; // Platform 추가
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
import { formatBirthAndAge, getAgeFromBirthdate } from "@/utils/util/birthdate";
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
      router.dismissAll();
    } catch (e: any) {
      if (e) {
        showAlert(e.response.data.message);
        return;
      }
    } finally {
      setLoading(false);
    }
  };
  const gender = draft.gender === "MALE" ? "남성" : "여성";

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
        {/* --- ⬇️ JSX 구조가 일부 수정되었습니다 ⬇️ --- */}
        <View style={{ paddingHorizontal: 10, paddingTop: 8 }}>
          <SignupHeader
            title={`멋진 프로필이 완성됐어요!`}
            subtitle={`다른 사람들에게 이렇게 보여질 거예요.\n\n언제든지 수정할 수 있으니 걱정 마세요.`}
          />
        </View>

        {/* 프로필 콘텐츠를 감싸는 카드 View */}
        <View style={styles.profileCard}>
          {/* 헤더/베이직 정보 */}
          <View style={{ gap: 8 }}>
            <AppText style={styles.brand}>SORAM</AppText>
            <AppText style={styles.caption}>
              이야기와 목소리로 연결된 우리
            </AppText>
            <AppText style={styles.name}>{draft.nickname || "-"}</AppText>
            <AppText style={styles.meta}>
              {formatBirthAndAge(draft.birthdate)}
              <AppText style={styles.meta}>, {gender}</AppText>
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
            <AppText style={styles.sectionTitle}>관심있는 분야</AppText>
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
        {/* --- ⬆️ 여기까지 수정되었습니다 ⬆️ --- */}
      </View>
    </ScreenWithStickyAction>
  );
};

export default FinishPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- ⬇️ 이 스타일이 추가되었습니다 ⬇️ ---
  profileCard: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    padding: 20,
    // iOS를 위한 그림자
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    // Android를 위한 그림자
    elevation: 5,
  },
  brand: {
    color: "#FF7D4A",
    fontWeight: "bold",
    fontSize: 18,
  },
  caption: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5C4B44",
    marginTop: 8,
  },
  meta: {
    fontSize: 16,
    color: "#5C4B44",
  },
  section: {
    paddingTop: 20,
  }, // 중복되는 paddingHorizontal 제거
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5C4B44",
    marginVertical: 10,
    lineHeight: 24,
  },
  answerCard: {
    marginBottom: 10,
  },
  answer: {
    color: "#5C4B44",
    lineHeight: 30,
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 6,
  },
  tag: { color: "#5C4B44" },
});
