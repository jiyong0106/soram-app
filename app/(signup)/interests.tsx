import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { View, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import InterestBadgeGrid from "@/components/signup/InterestBadgeGrid";
import { useMemo, useState } from "react";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import SignupHeader from "@/components/signup/SignupHeader";

const InterestsPage = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const canProceed = useMemo(() => selected.length > 0, [selected]);
  const nickname = useSignupDraftStore((s) => s.draft.nickname);

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={!canProceed}
          style={styles.button}
          onPress={() => router.push("/(signup)/finish")}
        />
      }
    >
      <View style={styles.container}>
        <SignupHeader
          title={`${nickname}님의 관심사를 선택해 주세요`}
          subtitle="내가 좋아하는 걸 보여주면, 더 잘 연결될 수 있어요."
        />
        <InterestBadgeGrid onChangeSelected={setSelected} />
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
