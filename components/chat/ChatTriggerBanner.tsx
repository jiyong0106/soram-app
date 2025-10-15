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
    // 변경점 1: 최상위 View는 이제 위치와 그림자만 담당합니다. (배경색 없음)
    <View style={s.wrap}>
      {/* 변경점 2: 말풍선의 형태(테두리, 둥근 모서리)를 담당할 새로운 View를 추가합니다. */}
      <View style={s.bubbleContainer}>
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
      </View>

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
  // 변경점 3: wrap 스타일을 수정합니다. 배경색과 테두리를 제거하고, 그림자 효과를 추가하여 '떠 있는' 느낌을 강조합니다.
  wrap: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    // 그림자 속성 (iOS)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    // 그림자 속성 (Android)
    elevation: 3,
  },
  // 변경점 4: bubbleContainer 스타일을 새로 추가합니다.
  bubbleContainer: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "red", // 기존의 빨간색 테두리를 조금 더 부드러운 색으로 변경했습니다.
    overflow: "hidden", // 이 속성을 통해 자식 컴포넌트들이 둥근 모서리를 따라 잘리게 됩니다.
  },
  // 변경점 5: body는 이제 배경색과 패딩만 담당합니다.
  body: {
    padding: 12,
    backgroundColor: "#fff",
  },
});
