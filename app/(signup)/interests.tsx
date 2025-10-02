import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { View, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import InterestBadgeGrid from "@/components/signup/InterestBadgeGrid";
import { useMemo } from "react";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import SignupHeader from "@/components/signup/SignupHeader";

const InterestsPage = () => {
  const router = useRouter();

  // 무한 루프를 방지하기 위해 각 상태를 개별적으로 구독합니다.
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const interestIds = useSignupDraftStore((s) => s.draft.interestIds);

  const canProceed = useMemo(() => interestIds.length > 0, [interestIds]);

  const handleNext = () => {
    router.push("/(signup)/finish");
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={!canProceed}
          style={styles.button}
          onPress={handleNext}
        />
      }
    >
      <View style={styles.container}>
        <SignupHeader
          title={`${nickname}님의 관심사를 선택해 주세요`}
          subtitle="최대 5개까지 선택할 수 있어요"
        />
        <InterestBadgeGrid />
      </View>
    </ScreenWithStickyAction>
  );
};

export default InterestsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
