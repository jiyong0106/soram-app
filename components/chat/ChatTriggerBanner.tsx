import { StyleSheet, View, Keyboard } from "react-native";
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
    // 키패드가 올라와 있으면 먼저 내리고, 내려간 뒤 바텀시트를 띄운다
    Keyboard.dismiss();

    const present = () => actionSheetRef.current?.present?.(t);

    let handled = false;
    const onHide = () => {
      if (handled) return;
      handled = true;
      hideSub?.remove?.();
      willHideSub?.remove?.();
      clearTimeout(timerId);
      present();
    };

    // iOS: keyboardWillHide, Android: keyboardDidHide 를 모두 감지
    const hideSub = Keyboard.addListener?.("keyboardDidHide", onHide);
    const willHideSub = Keyboard.addListener?.("keyboardWillHide", onHide);

    // 키보드가 이미 없거나 이벤트가 오지 않는 환경을 대비한 짧은 타임아웃
    const timerId = setTimeout(onHide, 200);
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
