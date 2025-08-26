import { REASON_LABELS, ReportReasonType } from "@/utils/types/common";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReasonOption from "./ReasonOption";

type ReportReasonSelectorProps = {
  value: ReportReasonType | null;
  onChange: (v: ReportReasonType) => void;
  themeColor?: string;
};

const REASONS: ReportReasonType[] = [
  "SPAM_ADVERTISING",
  "INAPPROPRIATE_CONTENT",
  "ABUSE_HARASSMENT",
  "IMPERSONATION",
  "OTHER",
];

const ReportReasonSelector = ({
  value,
  onChange,
  themeColor = "#ff6b6b",
}: ReportReasonSelectorProps) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>신고 사유</Text>
      <View style={styles.group}>
        {REASONS.map((r) => (
          <ReasonOption
            key={r}
            label={REASON_LABELS[r]}
            selected={value === r}
            onPress={() => onChange(r)}
            themeColor={themeColor}
          />
        ))}
      </View>
    </View>
  );
};

export default ReportReasonSelector;

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  group: {
    gap: 10,
  },
});
