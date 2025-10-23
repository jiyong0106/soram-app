import { StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConnectionTrigger } from "@/utils/api/chatPageApi";
import { GetTriggerResponse } from "@/utils/types/chat";
import ChatTriggerHeader from "@/components/chat/ChatTriggerHeader";
import ChatTriggerTabs from "@/components/chat/ChatTriggerTabs";
import ChatTriggerSheet from "./ChatTriggerSheet";
import ScalePressable from "../common/ScalePressable";

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
  const title = " 어떤 주제와 이야기가 우리를 연결해 줬을까요?";

  if (!data) return null;

  const handleTabChange = (t: "mine" | "opponent") => {
    setActiveTab(t);
    actionSheetRef.current?.present?.(t);
  };

  return (
    <View style={s.wrap}>
      {/* ScalePressable로 bubbleContainer 전체를 감싸고, onPress 이벤트를 여기서 처리 */}
      <ScalePressable onPress={() => setExpanded((v) => !v)}>
        <View style={s.bubbleContainer}>
          {/* onTitlePress prop 제거 */}
          <ChatTriggerHeader title={title} expanded={expanded} />
          {expanded && (
            <View style={s.body}>
              <ChatTriggerTabs
                active={activeTab}
                onChange={handleTabChange}
                topicTitle={data.topic.title}
              />
            </View>
          )}
        </View>
      </ScalePressable>

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bubbleContainer: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FF7D4A",
    overflow: "hidden",
  },
  body: {
    padding: 12,
    backgroundColor: "#fff",
    marginTop: -4,
  },
});
