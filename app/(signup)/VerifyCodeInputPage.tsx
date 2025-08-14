import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { postVerifyOtp } from "@/utils/api/signupPageApi";
import { usePhoneNumberStore } from "@/utils/sotre/usePhoneNumberStore";
import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";

const VerifyCodeInputPage = () => {
  const [otp, setotp] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneNumber = usePhoneNumberStore((s) => s.phoneNumber);
  const clearPhoneNumber = usePhoneNumberStore((s) => s.clear);
  const setSignupToken = useSignupTokenStore((s) => s.setSignupToken);

  const isValid = otp.length === 4;
  const router = useRouter();

  const handlePress = async () => {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      const res = await postVerifyOtp({ phoneNumber, otp });

      // 1. 토큰 메모리 저장 후 프로필 입력으로
      if (res.signupToken) {
        // setSignupToken(res.signupToken);
        clearPhoneNumber(); // PII 정리
        router.replace("/(onboarding)");
        return;
      }

      // 2. 기존 유저 accessToken → SecureStore 저장 후 홈으로
      if (res.accessToken) {
        // await saveAccessToken(res.accessToken);
        clearPhoneNumber();
        router.replace("/(tabs)/chatList");
        return;
      }

      //  둘 다 없으면 예외 처리
      Alert.alert("오류", "응답이 올바르지 않습니다. 다시 시도해 주세요.");
    } catch (e: any) {
      if (e) {
        Alert.alert(e.response.data.message);
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
          color="#ff6b6b"
          textColor="#fff"
          disabled={!isValid || loading}
          onPress={handlePress}
          style={styles.button}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>인증 번호를 입력해 주세요</Text>
        <Text style={styles.desc}>
          인증 번호가 전송됐어요. 받은 번호를 입력하면 인증이 완료돼요.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="4자리 숫자"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setotp}
          maxLength={4}
        />
      </View>
    </ScreenWithStickyAction>
  );
};

export default VerifyCodeInputPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  desc: {
    color: "#888",
    marginBottom: 32,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    marginTop: 32,
  },
});
