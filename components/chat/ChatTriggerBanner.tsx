import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConnectionTrigger } from "@/utils/api/chatPageApi";
import { GetTriggerResponse } from "@/utils/types/chat";
import AppText from "@/components/common/AppText";
import ChatTriggerHeader from "@/components/chat/ChatTriggerHeader";
import ChatTriggerTabs from "@/components/chat/ChatTriggerTabs";
import ChatTriggerResponseCard from "@/components/chat/ChatTriggerResponseCard";

interface ChatTriggerBannerProps {
  roomId: number;
}

const ChatTriggerBanner = ({ roomId }: ChatTriggerBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"mine" | "opponent">("mine");

  const { data, isLoading, isError } = useQuery<GetTriggerResponse>({
    queryKey: ["connectionTrigger", roomId],
    queryFn: () => getConnectionTrigger(roomId),
    staleTime: 5 * 60 * 1000,
  });
  const title = "어떤 이야기가 우릴 연결해줬는지 확인해보세요";

  return (
    <View style={s.wrap}>
      <ChatTriggerHeader
        title={title}
        expanded={expanded}
        onToggle={() => setExpanded((p) => !p)}
      />

      {!expanded ? null : (
        <View style={s.body}>
          <ChatTriggerTabs active={activeTab} onChange={setActiveTab} />

          <View style={s.content}>
            {isLoading ? (
              <AppText style={s.dimText}>불러오는 중...</AppText>
            ) : isError || !data ? (
              <AppText style={s.dimText}>표시할 내용이 없습니다</AppText>
            ) : activeTab === "mine" ? (
              <ChatTriggerResponseCard
                type={data.myResponse.type}
                textContent={data.myResponse.textContent}
                audioUrl={data.myResponse.audioUrl}
                playtime={data.myResponse.playtime}
                topicTitle={data.topic.title}
              />
            ) : (
              <ChatTriggerResponseCard
                type={data.opponentResponse.type}
                textContent={data.opponentResponse.textContent}
                audioUrl={data.opponentResponse.audioUrl}
                playtime={data.opponentResponse.playtime}
                topicTitle={data.topic.title}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatTriggerBanner;

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  headerText: { fontWeight: "700", color: "#374151" },
  body: { paddingHorizontal: 12, paddingVertical: 10 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 10 },
  tab: {
    flex: 1,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  tabActive: { backgroundColor: "#ff6b6b", borderColor: "#FFD6C2" },
  tabText: { color: "#6B7280", fontWeight: "700" },
  tabTextActive: { color: "#fff" },
  content: {},
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

type CardProps = {
  type: "TEXT" | "VOICE";
  textContent: string | null;
  audioUrl: string | null;
  playtime: number | null;
  topicTitle: string;
};

const ResponseCard = ({
  type,
  textContent,
  audioUrl,
  playtime,
  topicTitle,
}: CardProps) => {
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
