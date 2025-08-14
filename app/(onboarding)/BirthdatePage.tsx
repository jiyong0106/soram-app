import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

const BirthdatePage = () => {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const isValid = useMemo(() => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (!y || !m || !d) return false;
    if (year.length !== 4) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    return true;
  }, [year, month, day]);

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          disabled={!isValid}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/LocationPage")}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.heroRow}>
          <Image
            source={require("@/assets/images/test.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>안녕!</Text>
          </View>
        </View>

        <Text style={styles.title}>OO님의 생일을 알려주세요</Text>

        <View style={styles.birthRow}>
          <TextInput
            style={[styles.input, styles.inputYear]}
            placeholder="19"
            keyboardType="number-pad"
            value={year}
            onChangeText={(t) => setYear(t.replace(/[^0-9]/g, "").slice(0, 4))}
            maxLength={4}
          />
          <TextInput
            style={[styles.input, styles.inputMd]}
            placeholder="MM"
            keyboardType="number-pad"
            value={month}
            onChangeText={(t) => setMonth(t.replace(/[^0-9]/g, "").slice(0, 2))}
            maxLength={2}
          />
          <TextInput
            style={[styles.input, styles.inputMd]}
            placeholder="DD"
            keyboardType="number-pad"
            value={day}
            onChangeText={(t) => setDay(t.replace(/[^0-9]/g, "").slice(0, 2))}
            maxLength={2}
          />
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
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  heroImage: {
    width: 56,
    height: 56,
  },
  speechBubble: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  speechText: {
    fontSize: 12,
    color: "#555",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  birthRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  inputYear: {
    width: 80,
  },
  inputMd: {
    width: 64,
  },
});
