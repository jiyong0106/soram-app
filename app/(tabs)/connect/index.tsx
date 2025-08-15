import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";
import { useRouter } from "expo-router";

const ACCESS_TOKEN_KEY = "access_token";

const ConnectPage = () => {
  const router = useRouter();
  // getState() 대신 구독 형태로 (변경 시 자동 리렌더)
  const signupToken = useSignupTokenStore((s) => s.signupToken);
  const clearSignupToken = useSignupTokenStore((s) => s.clear);

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
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    clearSignupToken();
    setAccessToken(null); // 화면 갱신
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ConnectPage</Text>

      <Text style={styles.label}>signupToken (메모리):</Text>
      <Text style={styles.value}>{signupToken ?? "없음"}</Text>

      <Text style={styles.label}>accessToken (SecureStore):</Text>
      <Text style={styles.value}>{accessToken}</Text>

      <TouchableOpacity
        onPress={handleClearAll}
        style={styles.btn}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>모든 토큰 초기화</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={styles.btn}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>홈 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConnectPage;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { marginTop: 8, color: "#666" },
  value: { color: "#222" },
  btn: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#ff6b6b",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
