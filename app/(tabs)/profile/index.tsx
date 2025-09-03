// app/(tabs)/profile/index.tsx (예시)
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";
import { useTicketsStore } from "@/utils/sotre/useTicketsStore";
import { useAuthStore } from "@/utils/sotre/useAuthStore";

const ProfilePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 전역 상태
  const signupToken = useSignupTokenStore((s) => s.signupToken);
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const resetTickets = useTicketsStore((s) => s.reset);

  // 🔑 현재 액세스 토큰 (반응형)
  const token = useAuthStore((s) => s.token);
  console.log("token===>", token);
  // 초기화(로그아웃): 쿼리/스토어/헤더 모두 정리
  const handleClearAll = async () => {
    // 1) 진행 중 네트워크 요청 취소
    await queryClient.cancelQueries();

    // 2) 토큰 제거 (SecureStore + axios 헤더 + 메모리) — useAuthStore가 책임
    await useAuthStore.getState().setToken(null);

    // 3) 기타 전역 스토어 정리
    clearSignupToken();
    resetTickets();

    // 4) React Query 캐시 정리
    queryClient.clear(); // 또는 queryClient.removeQueries()

    // 5) 라우팅
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkToken}>
        <Text style={styles.label}>signupToken (메모리):</Text>
        <Text style={styles.value}>{signupToken ?? "없음"}</Text>

        <Text style={styles.label}>accessToken (AuthStore):</Text>
        <Text style={styles.value}>{token ? token : "없음"}</Text>

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
