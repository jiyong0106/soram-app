import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { postRequestOtp } from "@/utils/api/authPageApi";
import { usePhoneNumberStore } from "@/utils/sotre/usePhoneNumberStore";
import useAlert from "@/utils/hooks/useAlert";

const AuthPage = () => {
  const phoneNumber = usePhoneNumberStore((s) => s.phoneNumber);
  const setPhoneNumber = usePhoneNumberStore((s) => s.setPhoneNumber);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const isValid = /^010\d{8}$/.test(phoneNumber);
  const router = useRouter();
  const { showAlert } = useAlert();
  //라우터

  const hadnlePress = async () => {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      // const res = await postRequestOtp({ phoneNumber });
      // showAlert(res.message, () =>
      // router.push({
      //   pathname: "/(auth)/VerifyCode",
      //   params: { phoneNumber },
      // })
      // );
      router.push({
        pathname: "/(auth)/VerifyCode",
        params: { phoneNumber },
      });
    } catch (e) {
      console.error("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="인증번호 전송"
          color="#ff6b6b"
          textColor="#fff"
          disabled={!isValid}
          style={styles.button}
          onPress={hadnlePress}
          loading={loading}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>휴대폰 번호를 입력해 주세요</Text>
        <Text style={styles.desc}>
          허위/중복 가입을 막고, 악성 사용자를 제재하는데 사용해요. 입력한
          번호는 절대 공개되지 않아요.
        </Text>
        <View style={styles.inputRow}>
          <Text style={styles.countryCode}>+82</Text>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="휴대폰 번호"
            keyboardType="number-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={11}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>
      </View>
    </ScreenWithStickyAction>
  );
};

export default AuthPage;

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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  countryCode: {
    fontSize: 18,
    color: "#222",
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderBottomWidth: 2,
    fontSize: 18,
    padding: 8,
    borderColor: "#E6E6E6",
  },
  button: {
    marginTop: 32,
  },
  inputFocused: {
    borderColor: "#ff6b6b",
  },
});
