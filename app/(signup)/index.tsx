import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import AppText from "@/components/common/AppText";
import SignupHeader from "@/components/signup/SignupHeader";
import { getNickname } from "@/utils/api/signupPageApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const MAX_LEN = 10;

const SignupPage = () => {
  const router = useRouter();
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const patch = useSignupDraftStore((s) => s.patch);
  const [focused, setFocused] = useState(false);
  // 닉네임 중복 체크 상태
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const timerRef = useRef<any>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const raw = nickname;
  const trimmed = raw.trim();
  const basicValid = trimmed.length > 0;
  const regexValid = /^[A-Za-z0-9가-힣]+$/.test(trimmed);
  const isValid = basicValid && regexValid && trimmed.length <= MAX_LEN;

  //  닉네임 변경 시 1초 디바운스 + 이전 요청 AbortController로 취소
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!basicValid) {
      setChecking(false);
      setAvailable(null);
      setMessage("");
      return;
    }

    if (!regexValid) {
      setChecking(false);
      setAvailable(false);
      setMessage("공백·특수문자 없이 2~10자로 입력해 주세요");
      return;
    }

    setChecking(true);
    const current = trimmed;
    timerRef.current = setTimeout(async () => {
      // 진행 중 요청이 있으면 취소
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        const res = await getNickname(current, controller.signal);
        setAvailable(!!res?.isAvailable);
        setMessage(
          res?.isAvailable
            ? "사용 가능한 닉네임이에요"
            : "이미 사용 중인 닉네임이에요"
        );
      } catch (e: any) {
        if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") {
          // 취소된 요청은 무시
          return;
        }
        if (e?.response?.status === 400) {
          // 유효성에 맞지 않는 닉네임
          setAvailable(false);
          setMessage("유효하지 않은 닉네임이에요");
        } else {
          setAvailable(null);
          setMessage("닉네임 확인 중 오류가 발생했어요");
        }
      } finally {
        if (controllerRef.current === controller) {
          setChecking(false);
          controllerRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [trimmed]);

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
          color="#FF7D4A"
          textColor="#fff"
          disabled={!(isValid && available === true) || checking}
          style={styles.button}
          onPress={handlePress}
        />
      }
    >
      <View style={styles.container}>
        <SignupHeader
          title="닉네임을 설정해 주세요"
          subtitle="사용 할 닉네임을 알려주세요, 언제든 바꿀 수 있어요!"
        />
        <View style={styles.inputWrap}>
          <TextInput
            style={[
              styles.input,
              focused && styles.inputFocused,
              available === false && styles.inputError,
              available === true && styles.inputSuccess,
            ]}
            placeholder="공백 · 특수문자 없이 2~10자"
            value={nickname}
            onChangeText={(t) => patch({ nickname: t.slice(0, MAX_LEN) })}
            maxLength={MAX_LEN}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {checking ? (
            <View style={styles.inputIcon}>
              <LoadingSpinner size="small" color="#FF7D4A" />
            </View>
          ) : available === true ? (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#10B981"
              style={styles.inputIcon}
            />
          ) : available === false ? (
            <Ionicons
              name="close-circle"
              size={18}
              color="#EF4444"
              style={styles.inputIcon}
            />
          ) : null}
          <AppText style={styles.counter}>
            {nickname.length}/{MAX_LEN}
          </AppText>
        </View>
        {message ? (
          <AppText
            style={[
              styles.status,
              checking && styles.statusNeutral,
              available === true && styles.statusOk,
              available === false && styles.statusWarn,
            ]}
          >
            {message}
          </AppText>
        ) : null}
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
    borderColor: "#FF7D4A",
  },
  inputIcon: {
    position: "absolute",
    right: 10,
    top: 18,
  },
  counter: {
    position: "absolute",
    right: 10,
    bottom: -18,
    fontSize: 12,
    color: "#999",
  },
  status: { marginTop: 10, fontSize: 12 },
  statusNeutral: { color: "#6B7280" },
  statusOk: { color: "#10B981" },
  statusWarn: { color: "#EF4444" },
  inputError: {
    borderColor: "#EF4444",
  },
  inputSuccess: {
    borderColor: "#10B981",
  },
});
