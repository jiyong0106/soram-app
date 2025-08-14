import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { useSignupDraftStore } from "@/utils/sotre/useSignupDraftStore";
import { FieldKey } from "@/utils/types/signup";
import { FIELDS, onlyDigits, parseBirth, validBirth } from "@/utils/util";

const BirthdatePage = () => {
  const router = useRouter();
  const draftBirthdate = useSignupDraftStore((s) => s.draft.birthdate);
  const patch = useSignupDraftStore((s) => s.patch);

  // 하나의 객체 상태로 관리
  const [date, setDate] = useState(() => parseBirth(draftBirthdate));
  const [focused, setFocused] = useState<FieldKey | null>(null);

  const isValid = useMemo(() => validBirth(date), [date]);

  const handleChange = (k: FieldKey, max: number) => (t: string) =>
    setDate((prev) => ({ ...prev, [k]: onlyDigits(t, max) }));

  const handlePress = () => {
    if (!isValid) return;
    const mm = date.month.padStart(2, "0");
    const dd = date.day.padStart(2, "0");
    const birthdate = `${date.year}-${mm}-${dd}`;
    patch({ birthdate: birthdate });
    router.push("/(signup)/Finish");
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
        <Image
          source={require("@/assets/images/test.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>OO님의 생일을 알려주세요</Text>

        <View style={styles.birthRow}>
          {FIELDS.map(({ key, ph, max, width }) => {
            const val = date[key];
            const isFocused = focused === key;
            return (
              <TextInput
                key={key}
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
  container: { flex: 1 },
  button: { marginTop: 32 },
  heroImage: { width: 150, height: 150 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#222" },
  birthRow: { flexDirection: "row", gap: 10 },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  inputFocused: { borderColor: "#ff6b6b" },
});
