import React, { ForwardedRef, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import SheetRow from "@/components/common/SheetRow";
import useAlert from "@/utils/hooks/useAlert";
import { postChatLeave, postUserBlock } from "@/utils/api/chatPageApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

interface ChatActionSheetProps {
  snapPoints?: ReadonlyArray<string | number>;
  blockedId: number;
  roomId: number;
  peerUserName: string;
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#111827", // gray-900
  sub: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  fill: "#F9FAFB", // gray-50
  danger: "#EF4444", // red-500
  icon: "#5C4B44",
};

const ChatActionSheet = (
  { snapPoints, blockedId, roomId, peerUserName }: ChatActionSheetProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const { peerUserId } = useLocalSearchParams<{ peerUserId: string }>();
  const { showAlert, showActionAlert } = useAlert();
  const router = useRouter();
  const qc = useQueryClient();

  const dismiss = () => (ref as any)?.current?.dismiss?.();

  const onReport = () => {
    dismiss();
    setTimeout(() => {
      router.push({ pathname: "/chat/report", params: { peerUserId } });
    }, 300);
  };

  const onBlock = () => {
    dismiss();
    showActionAlert(
      `${peerUserName}님을 차단하시겠습니까?`,
      "차단",
      async () => {
        if (!blockedId) return;
        try {
          await postUserBlock(blockedId);
          showAlert(`${peerUserName}님을 차단했습니다.`, () => {
            qc.invalidateQueries({ queryKey: ["getChatKey"] });
            router.dismissTo("/chat");
          });
        } catch (e: any) {
          if (e) {
            showAlert(e.response?.data?.message || "다시 시도해 주세요");
            return;
          }
          showAlert("차단 실패 에러");
        }
      }
    );
  };

  const onLeave = () => {
    dismiss();
    showActionAlert(
      `${peerUserName}님과의 \n 채팅방을 나가시겠어요?`,
      "나가기",
      async () => {
        try {
          await postChatLeave(roomId);
          qc.invalidateQueries({ queryKey: ["getChatKey"] });
          router.dismissTo("/chat");
        } catch (e: any) {
          if (e) {
            showAlert(e.response?.data?.message || "다시 시도해 주세요");
            return;
          }
        }
      }
    );
  };

  const onMute = () => {}; // 기능은 유지, UI만 변경

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={s.container}>
        {/* Group: 유틸 */}
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="notifications-off-outline"
                size={18}
                color={COLORS.icon}
              />
            }
            label="알림 끄기"
            onPress={onMute}
          />
        </View>
        {/* Group: 일반 */}
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={COLORS.icon}
              />
            }
            label="신고하기"
            onPress={onReport}
          />
        </View>

        {/* Group: 파괴적(빨간 아이콘으로 강조) */}
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={COLORS.danger}
              />
            }
            label="차단하기"
            onPress={onBlock}
          />
          <View style={s.divider} />
          <SheetRow
            icon={
              <Ionicons name="exit-outline" size={18} color={COLORS.danger} />
            }
            label="채팅방 나가기"
            onPress={onLeave}
          />
        </View>
        <View style={{ height: 8 }} />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(ChatActionSheet);

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  header: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 12,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.sub,
  },
  group: {
    backgroundColor: COLORS.fill,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    marginTop: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginLeft: 36, // 아이콘 영역만큼 들여 써서 라인이 깔끔하게 보이도록
  },
});
