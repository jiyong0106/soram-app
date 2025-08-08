import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";

const signUpPage = () => {
  const [phone, setPhone] = useState("");
  const isValid = phone.length >= 0;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>휴대폰 번호를 입력해 주세요</Text>
      <Text style={styles.desc}>
        허위/중복 가입을 막고, 악성 사용자를 제재하는데 사용해요. 입력한 번호는
        절대 공개되지 않아요.
      </Text>
      <View style={styles.inputRow}>
        <Text style={styles.countryCode}>+82</Text>
        <TextInput
          style={styles.input}
          placeholder="휴대폰 번호"
          keyboardType="number-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={11}
        />
      </View>
      <View style={{ marginTop: "auto" }}>
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          disabled={!isValid}
          style={styles.button}
          onPress={() => router.push("/(signUp)/VerifyCodeInputPage")}
        />
      </View>
    </View>
  );
};

export default signUpPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 8,
  },
  button: {
    marginTop: 32,
  },
});
