import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "@/components/common/AppText";
import { GetTriggerResponse } from "@/utils/types/chat";
import Button from "../common/Button";
import ChatTriggerResponseCard from "@/components/chat/ChatTriggerResponseCard";

export type ChatTriggerSheetRef = {
  present: (tab?: "mine" | "opponent") => void;
  dismiss: () => void;
};

interface ChatTriggerSheetProps {
  snapPoints?: ReadonlyArray<string | number>;
  item: GetTriggerResponse;
  initialTab?: "mine" | "opponent";
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#5C4B44",
  sub: "#B0A6A0",
  border: "#E5E7EB",
  fill: "#F9FAFB",
  icon: "#1F2937",
  badgeBg: "#EEF2FF",
  badgeText: "#3730A3",
  divider: "#F3F4F6",
  shadow: "#00000022",
  topicPillBg: "#F3F4F6",
  topicPillText: "#6B7280",
  accent: "#FF6B3E",
};

const ChatTriggerSheet = (
  { snapPoints, initialTab = "mine", item }: ChatTriggerSheetProps,
  ref: ForwardedRef<ChatTriggerSheetRef>
) => {
  const bottomRef = useRef<BottomSheetModal>(null);
  const [active, setActive] = useState<"mine" | "opponent">(initialTab);
  const { myResponse, opponentResponse, topic } = item;

  useImperativeHandle(ref, () => ({
    present: (tab) => {
      if (tab) setActive(tab);
      bottomRef.current?.present?.();
    },
    dismiss: () => bottomRef.current?.dismiss?.(),
  }));

  const dismiss = () => bottomRef.current?.dismiss?.();

  const activeLabel = active === "mine" ? "내 이야기" : "상대방 이야기";

  return (
    <AppBottomSheetModal ref={bottomRef} snapPoints={snapPoints}>
      <View style={s.container}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.topicPillContainer}>
              <View style={s.activeLabelPill}>
                <Ionicons
                  name={
                    active === "mine"
                      ? "person-outline"
                      : "person-circle-outline"
                  }
                  size={14}
                  color={COLORS.badgeText}
                />
                <AppText style={s.badgeText}>{activeLabel}</AppText>
              </View>
            </View>
            <AppText style={s.title} numberOfLines={2}>
              {topic.title}
            </AppText>
          </View>
        </View>

        <View style={s.divider} />

        {/* 컨텐츠 카드 */}
        <View style={s.cardWrap}>
          <ChatTriggerResponseCard
            item={active === "mine" ? myResponse : opponentResponse}
          />
        </View>

        {/* 하단 액션 */}
        <View style={s.footer}>
          <Button
            onPress={dismiss}
            label="닫기"
            color={COLORS.accent}
            textColor="#fff"
          />
        </View>
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(ChatTriggerSheet);

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: COLORS.bg,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: { flex: 1 },

  topicPillContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  activeLabelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.topicPillBg, // 회색 배경 적용
    borderRadius: 999,
  },

  title: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 24,
  },

  badgeText: {
    color: COLORS.badgeText,
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 14,
    marginBottom: 12,
  },
  cardWrap: {
    marginBottom: 16,
    maxHeight: 450,
  },
  footer: {
    marginTop: 6,
  },
});
