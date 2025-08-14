import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSignupDraftStore } from "@/utils/sotre/useSignupDraftStore";
import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";
import { SignupSumbitBody } from "@/utils/types/signup";
import { postSignupSumbit } from "@/utils/api/signupPageApi";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";

const FinishPage = () => {
  const router = useRouter();
  const { draft } = useSignupDraftStore.getState();
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const signupToken = useSignupTokenStore.getState().signupToken;
  console.log("draft==>", draft);
  console.log("signupToken===>", signupToken);

  const handlePress = async () => {
    try {
      // ✅ 현재 인풋값으로 스토어 값 덮어써서 body 구성 (patch 불필요)
      const body: SignupSumbitBody = {
        signupToken,
        ...draft,
      };

      const { accessToken } = await postSignupSumbit(body);
      console.log("accessToken====>", accessToken);

      // await SecureStore.setItemAsync("accessToken", accessToken, {
      //   keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      // });

      // 필요 시 드래프트/토큰 정리
      useSignupDraftStore.getState().reset?.();
      //사인업 토큰 정리
      clearSignupToken();
      router.replace("/(tabs)/chatList");
    } catch (e) {
      // 에러 핸들링
      console.log(e);
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
        <Text>여기서 버튼 누르면 회원가입 완료! </Text>
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
