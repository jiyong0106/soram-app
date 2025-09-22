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

const FinishPage = () => {
  const router = useRouter();
  const { draft } = useSignupDraftStore.getState();
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
        <AppText>여기서 버튼 누르면 회원가입 완료! </AppText>
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
  heroImage: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  birthRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  inputFocused: {
    borderColor: "#FF7D4A",
  },
});
