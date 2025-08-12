import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";

const VerifyCodeInputPage = () => {
  const [code, setCode] = useState("");
  const isValid = code.length === 6;
  const router = useRouter();
  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          disabled={!isValid}
          onPress={() => router.push("/(signUp)/ProfileInputPage")}
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
          value={code}
          onChangeText={setCode}
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
