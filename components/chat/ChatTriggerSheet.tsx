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
import ChatTriggerTabs from "@/components/chat/ChatTriggerTabs";
import ChatTriggerResponseCard from "@/components/chat/ChatTriggerResponseCard";
import AppText from "@/components/common/AppText";
import { GetTriggerResponse } from "@/utils/types/chat";
import ScalePressable from "../common/ScalePressable";
import Button from "../common/Button";

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
  icon: "#111827",
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

  return (
    <AppBottomSheetModal ref={bottomRef} snapPoints={snapPoints}>
      <View style={s.container}>
        <AppText style={s.subtitle} numberOfLines={2}>
          {topic.title}
        </AppText>

        {active === "mine" ? (
          <ChatTriggerResponseCard item={myResponse} />
        ) : (
          <ChatTriggerResponseCard item={opponentResponse} />
        )}
        <Button
          onPress={dismiss}
          label="닫기"
          color="#ff6b6b"
          textColor="#fff"
        />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(ChatTriggerSheet);

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: { fontWeight: "700", color: COLORS.text },
  subtitle: { color: COLORS.sub, marginBottom: 12 },
  closeButton: { marginTop: 12 },
});
