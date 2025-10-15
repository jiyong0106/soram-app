import { StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConnectionTrigger } from "@/utils/api/chatPageApi";
import { GetTriggerResponse } from "@/utils/types/chat";
import ChatTriggerHeader from "@/components/chat/ChatTriggerHeader";
import ChatTriggerTabs from "@/components/chat/ChatTriggerTabs";
import ChatTriggerSheet from "./ChatTriggerSheet";

interface ChatTriggerBannerProps {
  roomId: number;
}

const ChatTriggerBanner = ({ roomId }: ChatTriggerBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"mine" | "opponent">("mine");
  const actionSheetRef = useRef<any>(null);

  const { data, isLoading, isError } = useQuery<GetTriggerResponse>({
    queryKey: ["connectionTrigger", roomId],
    queryFn: () => getConnectionTrigger(roomId),
    staleTime: 5 * 60 * 1000,
  });
  const title = "어떤 이야기가 우릴 연결해줬는지 확인해보세요";

  if (!data) return null;

  const handleTabChange = (t: "mine" | "opponent") => {
    setActiveTab(t);
    actionSheetRef.current?.present?.(t);
  };

  return (
    <View style={s.wrap}>
      <ChatTriggerHeader
        title={title}
        expanded={expanded}
        onTitlePress={() => setExpanded((v) => !v)}
      />
      {expanded && (
        <View style={s.body}>
          <ChatTriggerTabs active={activeTab} onChange={handleTabChange} />
        </View>
      )}
      <ChatTriggerSheet
        ref={actionSheetRef}
        snapPoints={["85%"]}
        item={data}
        initialTab={activeTab}
      />
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
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "red",
    overflow: "hidden",
  },

  body: { padding: 12 },
});
