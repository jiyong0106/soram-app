import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "@/components/common/AppText";

type Props = {
  type: "TEXT" | "VOICE";
  textContent: string | null;
  audioUrl: string | null;
  playtime: number | null;
  topicTitle: string;
};

const ChatTriggerResponseCard = ({
  type,
  textContent,
  audioUrl,
  playtime,
  topicTitle,
}: Props) => {
  if (type === "VOICE") {
    return (
      <View style={s.card}>
        <AppText style={s.topic}>{topicTitle}</AppText>
        <View style={s.voiceRow}>
          <AppText>음성 답변</AppText>
          {playtime ? <AppText style={s.dimText}>{playtime}s</AppText> : null}
        </View>
      </View>
    );
  }
  return (
    <View style={s.card}>
      <AppText style={s.topic}>{topicTitle}</AppText>
      <AppText style={s.text}>
        {textContent ?? "작성된 답변이 없습니다"}
      </AppText>
    </View>
  );
};

export default ChatTriggerResponseCard;

const s = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
  },
  topic: { color: "#9CA3AF", fontSize: 12, marginBottom: 8 },
  text: { color: "#111827", lineHeight: 20 },
  voiceRow: { flexDirection: "row", justifyContent: "space-between" },
  dimText: { color: "#9CA3AF" },
});
