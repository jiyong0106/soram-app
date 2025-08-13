import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { postVerifyOtp } from "@/utils/api/signUpPageApi";
import { usePhoneNumberStore } from "@/utils/sotre/usePhoneNumberStore";
import { AxiosError } from "axios";
import { isServerError } from "@/utils/api/axiosError";

const VerifyCodeInputPage = () => {
  const [otp, setotp] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneNumber = usePhoneNumberStore((s) => s.phoneNumber);
  const clearPhoneNumber = usePhoneNumberStore((s) => s.clear);

  const isValid = otp.length === 4;
  const router = useRouter();
  console.log("넘겨받은 핸드폰 번호==>", phoneNumber);

  const handlePress = async () => {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      const res = await postVerifyOtp({ phoneNumber, otp });
      Alert.alert("인증되었습니다.");
      clearPhoneNumber();
    } catch (e) {
      if (isServerError(e) && e.response && e.response.status === 404) {
        Alert.alert("이메일이나 비밀번호를 확인해 주세요");
        return;
      }
    }
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          disabled={!isValid}
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
          placeholder="6자리 숫자"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setotp}
          maxLength={6}
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
