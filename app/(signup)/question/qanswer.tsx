import React, { useMemo, useState } from "react";
import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import AppText from "@/components/common/AppText";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useLocalSearchParams } from "expo-router";

const MAX_LEN = 1000;

const QanswerPage = () => {
  const { label, variant } = useLocalSearchParams();
  // UI 전용 상태 (기능 연동 전)
  const [text, setText] = useState("");

  const countColor = useMemo(() => {
    if (text.length === 0) return styles.countNeutral.color as string;
    if (text.length < 120) return styles.countGuide.color as string;
    if (text.length > MAX_LEN) return styles.countWarn.color as string;
    return styles.countOk.color as string;
  }, [text.length]);

  const isOver = text.length > MAX_LEN;

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="다음"
          color="#FF7D4A"
          textColor="#fff"
          disabled={text.trim().length === 0 || isOver}
          onPress={() => {}}
        />
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* 상단 메타 정보 */}
        <View style={styles.metaWrap}>
          <View style={styles.badges}>
            <View style={styles.badgePrimary}>
              <AppText style={styles.badgePrimaryText}>
                {variant === "required" ? "필수" : "선택"}
              </AppText>
            </View>
            <View style={styles.badgeTone}>
              <AppText style={styles.badgeToneText}>자기소개</AppText>
            </View>
          </View>
          <AppText style={styles.questionTitle}>{label}</AppText>
        </View>

        {/* 입력 영역 카드 */}
        <View style={styles.inputCard}>
          {/* 툴바 (톤/가이드) */}

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder=""
            placeholderTextColor="#9CA3AF"
            style={styles.textarea}
            multiline
            textAlignVertical="top"
            maxLength={MAX_LEN} // UI 보호용(실제 제한은 MAX_LEN)
            numberOfLines={7}
          />

          {/* 카운터 & 가이드 */}
          <View style={styles.counterRow}>
            <AppText style={[styles.counter, { color: countColor }]}>
              {text.length} / {MAX_LEN}자
            </AppText>
            <AppText
              style={[styles.counterGuide, isOver && styles.counterGuideWarn]}
            >
              {isOver
                ? "최대 글자 수를 초과했어요"
                : "100자 이상이면 더 좋아요"}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </ScreenWithStickyAction>
  );
};

export default QanswerPage;

const styles = StyleSheet.create({
  container: {
    gap: 18,
    flexGrow: 1,
  },

  /* 상단 메타 */
  metaWrap: { gap: 8, marginTop: 8 },
  badges: { flexDirection: "row", gap: 8 },
  badgePrimary: {
    backgroundColor: "#FFF1EC",
    borderColor: "#FF7D4A",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgePrimaryText: { color: "#FF7D4A", fontWeight: "600", fontSize: 12 },
  badgeTone: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeToneText: { color: "#6B7280", fontSize: 12 },
  questionTitle: { fontSize: 18, color: "#111827", fontWeight: "bold" },

  /* 입력 카드 */
  inputCard: {
    borderWidth: 1,
    borderColor: "#FF6B3E",
    backgroundColor: "#FFF8F5",
    borderRadius: 12,
    paddingBottom: 12,
    gap: 10,
  },

  textarea: {
    minHeight: 180,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },

  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  counter: { fontSize: 12, fontWeight: "600" },
  countNeutral: { color: "#9CA3AF" },
  countGuide: { color: "#6B7280" },
  countOk: { color: "#10B981" },
  countWarn: { color: "#EF4444" },

  counterGuide: { fontSize: 12, color: "#6B7280" },
  counterGuideWarn: { color: "#EF4444" },
});
