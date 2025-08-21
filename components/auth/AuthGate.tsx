import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter, useSegments } from "expo-router";

import * as SecureStore from "expo-secure-store";

import {
  bootstrapAuthToken,
  isTokenExpired,
  TOKEN_KEY,
} from "@/utils/util/auth";

type Props = { children: React.ReactNode };

const AuthGate = ({ children }: Props) => {
  const [state, setState] = useState<"loading" | "auth" | "guest">("loading");
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      await bootstrapAuthToken();
      const t = await SecureStore.getItemAsync(TOKEN_KEY);
      const authed = !!t && !isTokenExpired(t);
      setState(authed ? "auth" : "guest");
    })();
  }, []);

  useEffect(() => {
    if (state === "loading") return;

    // 그룹 판별: (tabs)는 보호, (auth)/(signup)/index는 공개
    const first = segments[0];
    const inProtected = first === "(tabs)";
    const inPublic = first === "(auth)" || first === "(signup)" || !first;

    if (state === "auth" && inPublic) {
      // 로그인 상태 → 메인으로
      router.replace("/(tabs)/connections");
    } else if (state === "guest" && inProtected) {
      // 비로그인 상태 → 루트(온보딩/로그인)
      router.replace("/");
    }
  }, [state, segments]);

  if (state === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
