import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import AppText from "../common/AppText";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  minLen?: number;
  maxLen?: number;
  placeholder?: string;
  helperText?: string;
  themeColor?: string;
};

const ReportDetailsInput = ({
  value,
  onChangeText,
  minLen = 0,
  maxLen = 1000,
  placeholder = "상세 내용을 입력하세요.",
  helperText,
  themeColor = "#ff6b6b",
}: Props) => {
  const len = value.length;
  const tooShort = len < minLen;

  return (
    <View>
      <AppText style={styles.title}>상세 내용</AppText>
      {helperText ? (
        <AppText style={styles.helper}>{helperText}</AppText>
      ) : null}

      <View
        style={[styles.box, { borderColor: tooShort ? themeColor : "#e5e5e5" }]}
      >
        <TextInput
          value={value}
          onChangeText={(t) => {
            if (t.length <= maxLen) onChangeText(t);
          }}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          style={styles.input}
          accessibilityLabel="신고 상세 내용"
        />
      </View>

      <View style={styles.footer}>
        <AppText style={[styles.counter, tooShort && { color: themeColor }]}>
          {len}/{maxLen}
        </AppText>
        {minLen > 0 && (
          <AppText style={[styles.minText, tooShort && { color: themeColor }]}>
            최소 {minLen}자
          </AppText>
        )}
      </View>
    </View>
  );
};

export default ReportDetailsInput;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  box: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    minHeight: 120,
    fontSize: 15,
    color: "#222",
    lineHeight: 22,
  },
  footer: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  counter: { fontSize: 12, color: "#999" },
  minText: { fontSize: 12, color: "#999" },
});
