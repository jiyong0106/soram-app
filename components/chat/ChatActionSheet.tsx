import React, { ForwardedRef, forwardRef } from "react";
import { View } from "react-native";
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
}

const ChatActionSheet = (
  { snapPoints, blockedId, roomId }: ChatActionSheetProps,
  ref: ForwardedRef<BottomSheetModal>
) => {
  const { peerUserId } = useLocalSearchParams<{
    peerUserId: string;
  }>();

  const { showAlert, showActionAlert } = useAlert();
  const router = useRouter();
  const qc = useQueryClient();

  //모달 닫기
  const dismiss = () => (ref as any)?.current?.dismiss?.();

  //신고
  const onReport = () => {
    dismiss();
    setTimeout(() => {
      router.push({
        pathname: "/chat/report",
        params: {
          peerUserId: peerUserId,
        },
      });
    }, 300);
  };

  //차단

  const onBlock = () => {
    dismiss();
    showActionAlert("차단?", "확인", async () => {
      if (!blockedId) return;
      try {
        await postUserBlock(blockedId);
        showAlert("차단 성공!", () => {
          qc.invalidateQueries({ queryKey: ["getChatKey"] });
          router.dismissTo("/chat");
        });
      } catch (e: any) {
        if (e) {
          showAlert(e.response.data.message || "다시 시도해 주세요");
          return;
        }
        showAlert("차단 실패 에러");
      } finally {
      }
    });
  };

  //나가기
  const onLeave = () => {
    dismiss();
    showActionAlert("채팅방을 나가시나요?", "확인", async () => {
      try {
        await postChatLeave(roomId);
        qc.invalidateQueries({ queryKey: ["getChatKey"] });
        router.dismissTo("/chat");
      } catch (e: any) {
        if (e) {
          showAlert(e.response.data.message || "다시 시도해 주세요");
          return;
        }
      }
    });
  };

  //알림끄기
  const onMute = () => console.log("onMute");

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={{ padding: 16 }}>
        <SheetRow
          icon={<Ionicons name="alert-circle-outline" size={18} />}
          label="신고하기"
          onPress={onReport}
        />
        <SheetRow
          icon={<Ionicons name="close-circle-outline" size={18} />}
          label="차단하기"
          onPress={onBlock}
        />
        <SheetRow
          icon={<Ionicons name="exit-outline" size={18} />}
          label="채팅방 나가기"
          onPress={onLeave}
        />
        <SheetRow
          icon={<Ionicons name="notifications-off-outline" size={18} />}
          label="알림 끄기"
          onPress={onMute}
        />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(ChatActionSheet);
