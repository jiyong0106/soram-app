import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { FieldKey } from "@/utils/types/signup";
import {
  FIELDS,
  onlyDigits,
  parseBirth,
  validBirth,
} from "@/utils/util/birthdate";
import AppText from "@/components/common/AppText";

const order: FieldKey[] = ["year", "month", "day"];

const BirthdatePage = () => {
  const router = useRouter();
  const draftBirthdate = useSignupDraftStore((s) => s.draft.birthdate);
  const patch = useSignupDraftStore((s) => s.patch);
  const nickname = useSignupDraftStore((s) => s.draft.nickname);

  const [date, setDate] = useState(() => parseBirth(draftBirthdate));
  const [focused, setFocused] = useState<FieldKey | null>(null);

  const isValid = useMemo(() => validBirth(date), [date]);

  const inputRefs = useRef<Record<FieldKey, TextInput | null>>({
    year: null,
    month: null,
    day: null,
  });

  const focusNext = (k: FieldKey) => {
    const idx = order.indexOf(k);
    const next = order[idx + 1];
    if (next) inputRefs.current[next]?.focus();
  };

  const handleChange = (k: FieldKey, max: number) => (t: string) => {
    const cleaned = onlyDigits(t, max);
    setDate((prev) => ({ ...prev, [k]: cleaned }));

    if (cleaned.length === max) {
      focusNext(k);
    }
  };

  const handlePress = () => {
    if (!isValid) return;
    const mm = date.month.padStart(2, "0");
    const dd = date.day.padStart(2, "0");
    const birthdate = `${date.year}-${mm}-${dd}`;
    patch({ birthdate });
    router.push("/(signup)/answers");
  };

  const setInputRef = (k: FieldKey) => (r: TextInput | null) => {
    inputRefs.current[k] = r;
  };

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={!isValid}
          style={styles.button}
          onPress={handlePress}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <AppText style={styles.title}>
            {nickname}님의 생년월일을 알려주세요
          </AppText>
          <AppText style={styles.subtitle}>
            생년월일은 나이 표시 용도로만 사용돼요!
          </AppText>
        </View>

        <View style={styles.birthRow}>
          {FIELDS.map(({ key, ph, max, width }) => {
            const val = date[key];
            const isFocused = focused === key;
            return (
              <TextInput
                key={key}
                ref={setInputRef(key)}
                style={[
                  styles.input,
                  { width },
                  isFocused && styles.inputFocused,
                ]}
                placeholder={ph}
                keyboardType="number-pad"
                value={val}
                onChangeText={handleChange(key, max)}
                maxLength={max}
                onFocus={() => setFocused(key)}
                onBlur={() => setFocused(null)}
                returnKeyType={key === "day" ? "done" : "next"}
              />
            );
          })}
        </View>
      </View>
    </ScreenWithStickyAction>
  );
};

export default BirthdatePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  headerTitle: {
    marginBottom: 30,
    marginTop: 15,
    gap: 10,
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
  birthRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  inputFocused: { borderColor: "#FF7D4A" },
});
