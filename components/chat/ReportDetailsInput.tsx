import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

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
      <Text style={styles.title}>상세 내용</Text>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}

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
        <Text style={[styles.counter, tooShort && { color: themeColor }]}>
          {len}/{maxLen}
        </Text>
        {minLen > 0 && (
          <Text style={[styles.minText, tooShort && { color: themeColor }]}>
            최소 {minLen}자
          </Text>
        )}
      </View>
    </View>
  );
};

export default ReportDetailsInput;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
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
