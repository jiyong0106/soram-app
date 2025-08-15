import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSignupDraftStore } from "@/utils/sotre/useSignupDraftStore";

const MAX_LEN = 10;

const SignupPage = () => {
  const router = useRouter();
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const patch = useSignupDraftStore((s) => s.patch);
  const [focused, setFocused] = useState(false);

  const isValid = nickname.trim().length > 0;

  const handlePress = () => {
    if (!isValid) return;
    // 이미 스토어에 들어가 있으므로 별도 저장 없이 이동
    router.push("/(signup)/gender");
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          disabled={!isValid}
          style={styles.button}
          onPress={handlePress}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>닉네임을 설정해 주세요</Text>
          <Text style={styles.subtitle}>
            사용 할 닉네임을 알려주세요, 언제든 바꿀 수 있어요!
          </Text>
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="공백 · 특수문자 없이 1~10자"
            value={nickname}
            onChangeText={(t) => patch({ nickname: t.slice(0, MAX_LEN) })}
            maxLength={MAX_LEN}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <Text style={styles.counter}>
            {nickname.length}/{MAX_LEN}
          </Text>
        </View>
      </View>
    </ScreenWithStickyAction>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  headerTitle: {
    marginBottom: 30,
    gap: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#F1C0B5",
    borderRadius: 10,
    height: 55,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    fontSize: 14,
  },
  inputFocused: {
    borderColor: "#ff6b6b",
  },
  counter: {
    position: "absolute",
    right: 10,
    bottom: -18,
    fontSize: 12,
    color: "#999",
  },
});
