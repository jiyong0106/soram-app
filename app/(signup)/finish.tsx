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
import * as SecureStore from "expo-secure-store";
import AppText from "@/components/common/AppText";

const FinishPage = () => {
  const router = useRouter();
  const { draft } = useSignupDraftStore.getState();
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const signupToken = useSignupTokenStore.getState().signupToken;
  const { showAlert } = useAlert();
  const handlePress = async () => {
    try {
      // ✅ 현재 인풋값으로 스토어 값 덮어써서 body 구성 (patch 불필요)
      const body: SignupSumbitBody = {
        signupToken,
        ...draft,
      };
      //서버 응답값 엑세스토큰
      const res = await postSignupSumbit(body);
      // 엑세스 토큰 스토어에 저장
      await SecureStore.setItemAsync("access_token", res.accessToken);

      // 드래프트/토큰 정리
      useSignupDraftStore.getState().reset?.();

      //사인업 토큰 정리
      clearSignupToken();

      //라우터 이동
      router.replace("/(tabs)/topic");
    } catch (e: any) {
      if (e) {
        showAlert(e.response.data.message);
        return;
      }
    }
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          // disabled={!isValid}
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
    borderColor: "#ff6b6b",
  },
});
