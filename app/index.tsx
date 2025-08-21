// import { Button, StyleSheet, View } from "react-native";
// import Description from "../components/index/Description";
// import LoginButton from "../components/index/LoginButton";
// import LogoHeader from "../components/index/LogoHeader";
// import StartButton from "../components/index/StartButton";
// import TermsNotice from "../components/index/TermsNotice";
// import WelcomeImage from "../components/index/WelcomeImage";
// import PageContainer from "@/components/common/PageContainer";
// import { useRouter } from "expo-router";

// const Index = () => {
//   const router = useRouter();
//   return (
//     <PageContainer edges={["top", "bottom"]}>
//       <View style={styles.container}>
//         <LogoHeader />
//         <View style={styles.body}>
//           <WelcomeImage />
//           <Description />
//           <TermsNotice />
//           <StartButton />
//           {/* <LoginButton />
//           <Button
//             title="온보디 들어가기"
//             onPress={() => router.push("/(signup)")}
//           /> */}
//         </View>
//       </View>
//     </PageContainer>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//   },
//   body: {
//     flex: 1,
//     width: "100%",
//     justifyContent: "flex-end",
//     gap: 10,
//   },
// });

import { Button, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Description from "../components/index/Description";
import LoginButton from "../components/index/LoginButton";
import LogoHeader from "../components/index/LogoHeader";
import StartButton from "../components/index/StartButton";
import TermsNotice from "../components/index/TermsNotice";
import WelcomeImage from "../components/index/WelcomeImage";
import PageContainer from "@/components/common/PageContainer";
import { useRouter } from "expo-router";
import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getConnections } from "@/utils/api/connectionsPageApi";

const ACCESS_TOKEN_KEY = "access_token";

const Index = () => {
  const router = useRouter();

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
  console.log("accessToken===>", accessToken);

  //데이터요청 확인

  return (
    <PageContainer edges={["top", "bottom"]}>
      <View style={styles.container}>
        <LogoHeader />
        <View style={styles.body}>
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
              <Text style={styles.btnText}>모든 토큰 초기화</Text>
            </TouchableOpacity>
          </View>
          <TermsNotice />
          <StartButton />
          <LoginButton />
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  body: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
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
