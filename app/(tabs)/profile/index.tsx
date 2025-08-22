import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { setAuthToken } from "@/utils/util/auth";

const ACCESS_TOKEN_KEY = "access_token";

const ProfilePage = () => {
  const signupToken = useSignupTokenStore((s) => s.signupToken);
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // SecureStore에서 access_token 읽기
  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      setAccessToken(t);
    })();
  }, []);

  // 초기화: SecureStore + zustand 동시 정리
  const handleClearAll = async () => {
    // 1) 진행 중인 쿼리 취소
    await queryClient.cancelQueries();

    // 2) 토큰 정리 (저장소 + 메모리)
    await setAuthToken(null);

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);

    clearSignupToken();

    // 3) React Query 캐시 초기화
    queryClient.removeQueries();

    // 4) 화면 상태 갱신
    setAccessToken(null);
    router.replace("/");
  };

  console.log("accessToken===>", accessToken);

  //데이터요청 확인

  return (
    <View style={styles.container}>
      <View style={styles.checkToken}>
        <Text style={styles.label}>signupToken (메모리):</Text>
        <Text style={styles.value}>{signupToken ?? "없음"}</Text>

        <Text style={styles.label}>accessToken (SecureStore):</Text>
        <Text style={styles.value}>{accessToken}</Text>

        <TouchableOpacity
          onPress={handleClearAll}
          style={styles.btn}
          activeOpacity={0.7}
        >
          <Text style={styles.btnText}>모든 토큰 초기화 후 홈 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 8,
    color: "#666",
  },
  value: {
    color: "#222",
  },
  btn: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#ff6b6b",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  checkToken: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
  },
});
