import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { postRequestOtp, postVerifyOtp } from "@/utils/api/authPageApi";
import { usePhoneNumberStore } from "@/utils/store/usePhoneNumberStore";
import { useSignupTokenStore } from "@/utils/store/useSignupTokenStore";
import useAlert from "@/utils/hooks/useAlert";
import AppText from "@/components/common/AppText";
import { useAuthStore } from "@/utils/store/useAuthStore";
import SignupHeader from "@/components/signup/SignupHeader";

const VerifyCodeInputPage = () => {
  const [otp, setotp] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const phoneNumber = usePhoneNumberStore((s) => s.phoneNumber);
  const clearPhoneNumber = usePhoneNumberStore((s) => s.clear);
  const setSignupToken = useSignupTokenStore((s) => s.setSignupToken);
  const { showAlert } = useAlert();
  const isValid = otp.length === 4;
  const router = useRouter();

  //인증번호 서버로 전송
  const handlePress = async () => {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      const res = await postVerifyOtp({ phoneNumber, otp });

      // 1. 토큰 메모리 저장 후 프로필 입력으로
      if (res.signupToken) {
        setSignupToken(res.signupToken);
        clearPhoneNumber(); // PII 정리
        router.replace("/(signup)");
        return;
      }

      // 2. 기존 유저 accessToken → SecureStore 저장 후 홈으로
      if (res.accessToken) {
        useAuthStore.getState().setToken(res.accessToken);
        clearPhoneNumber();
        router.replace("/(tabs)/topic");
        return;
      }

      //  둘 다 없으면 예외 처리
      showAlert("응답이 올바르지 않습니다. 다시 시도해 주세요.");
    } catch (e: any) {
      if (e) {
        showAlert(e.response.data.message);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  //인증번호 재요청
  const handleRequestOtp = async () => {
    if (loading) return;

    Alert.alert(
      "인증번호 재요청",
      "인증번호를 다시 요청하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              setLoading(true);
              await postRequestOtp({ phoneNumber });
              showAlert("인증번호가 전송되었습니다.");
            } catch (e: any) {
              if (e) {
                showAlert(e.response.data.message);
                return;
              }
              console.error("");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={!isValid || loading}
          onPress={handlePress}
          style={styles.button}
        />
      }
    >
      <View style={styles.container}>
        <SignupHeader
          title="인증번호를 입력해 주세요"
          subtitle={"받은 번호를 입력하면 인증이 완료돼요."}
        />
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="4자리 숫자"
          placeholderTextColor={"#B0A6A0"}
          keyboardType="number-pad"
          value={otp}
          onChangeText={setotp}
          maxLength={4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <TouchableOpacity onPress={handleRequestOtp} activeOpacity={0.5}>
          <AppText style={styles.desc}>{"\n인증번호 다시 요청하기 >"}</AppText>
        </TouchableOpacity>
      </View>
    </ScreenWithStickyAction>
  );
};

export default VerifyCodeInputPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desc: {
    color: "#5C4B44",
    marginBottom: 32,
    marginRight: 10,
    fontSize: 12,
    textAlign: "right",
  },
  input: {
    borderBottomWidth: 2,
    fontSize: 18,
    padding: 8,
    marginBottom: 16,
    borderColor: "#E6E6E6",
  },
  button: {
    marginTop: 32,
  },
  inputFocused: {
    borderColor: "#FF7D4A",
  },
});
