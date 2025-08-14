import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { useSignupDraftStore } from "@/utils/sotre/useSignupDraftStore";

// 유틸
const onlyDigits = (s: string, max: number) =>
  s.replace(/\D/g, "").slice(0, max);
const parseBirth = (v?: string) => {
  if (!v) return { year: "", month: "", day: "" };
  const [y = "", m = "", d = ""] = v.split("-");
  return { year: y, month: m, day: d };
};
const validBirth = ({
  year,
  month,
  day,
}: {
  year: string;
  month: string;
  day: string;
}) => {
  if (year.length !== 4 || month.length === 0 || day.length === 0) return false;
  const y = +year,
    m = +month,
    d = +day;
  if (!y || m < 1 || m > 12) return false;
  const dim = new Date(y, m, 0).getDate();
  return d >= 1 && d <= dim;
};

type FieldKey = "year" | "month" | "day";

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
    patch({ birthdate: `${date.year}-${mm}-${dd}` });
    // router.push("/(signup)/LocationPage");
  };

  const FIELDS: Array<{
    key: FieldKey;
    ph: string;
    max: number;
    width: number;
  }> = [
    { key: "year", ph: "YYYY", max: 4, width: 100 },
    { key: "month", ph: "MM", max: 2, width: 80 },
    { key: "day", ph: "DD", max: 2, width: 80 },
  ];

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
