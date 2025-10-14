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
  text: "#111827",
  sub: "#6B7280",
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

  const activeLabel = active === "mine" ? "내 답변" : "상대 답변";

  return (
    <AppBottomSheetModal ref={bottomRef} snapPoints={snapPoints}>
      <View style={s.container}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.topicPill}>
              <Ionicons
                name="chatbubbles-outline"
                size={14}
                color={COLORS.sub}
              />
              <AppText style={s.topicPillText} numberOfLines={1}>
                연결 주제
              </AppText>
            </View>

            <AppText style={s.title} numberOfLines={2}>
              {topic.title}
            </AppText>

            <View style={s.metaRow}>
              <View style={s.badge}>
                <Ionicons
                  name={
                    active === "mine"
                      ? "person-circle-outline"
                      : "person-outline"
                  }
                  size={14}
                  color={COLORS.badgeText}
                />
                <AppText style={s.badgeText}>{activeLabel}</AppText>
              </View>
            </View>
          </View>

          {/* 우측 아이콘 영역(디자인용, 기능 X) */}
          <View style={s.headerRight}>
            <View style={s.iconBadge}>
              <Ionicons name="sparkles-outline" size={18} color={COLORS.icon} />
            </View>
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
  headerRight: { paddingLeft: 8 },

  topicPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.topicPillBg,
    borderRadius: 999,
    marginBottom: 8,
  },
  topicPillText: {
    color: COLORS.topicPillText,
    fontSize: 12,
  },

  title: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 24,
  },

  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.badgeBg,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  badgeText: {
    color: COLORS.badgeText,
    fontSize: 12,
    fontWeight: "600",
  },

  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.fill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 14,
    marginBottom: 12,
  },

  cardWrap: {
    // 카드가 떠보이도록 마진 조절
    marginBottom: 16,
    maxHeight: 450,
  },

  footer: {
    marginTop: 6,
  },
});
