import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppText from "@/components/common/AppText";
import { ChatTriggerDto } from "@/utils/types/chat";

type Props = {
  item: ChatTriggerDto;
};

const ChatTriggerResponseCard = ({ item }: Props) => {
  const { type, textContent, audioUrl, playtime } = item;
  if (type === "VOICE") {
    return (
      <View style={s.card}>
        <View style={s.voiceRow}>
          <AppText>음성 답변</AppText>
          {playtime ? <AppText style={s.dimText}>{playtime}s</AppText> : null}
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={s.card}>
      <AppText style={s.text}>
        {textContent ?? "작성된 답변이 없습니다"}
      </AppText>
    </ScrollView>
  );
};

export default ChatTriggerResponseCard;

const s = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "#E5E7EB",
    // borderRadius: 12,
    padding: 12,
  },
  topic: { color: "#9CA3AF", fontSize: 12, marginBottom: 8 },
  text: { color: "#5C4B44", lineHeight: 20 },
  voiceRow: { flexDirection: "row", justifyContent: "space-between" },
  dimText: { color: "#9CA3AF" },
});
