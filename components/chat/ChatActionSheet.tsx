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
  peerUserName: string;
}

const ChatActionSheet = (
  { snapPoints, blockedId, roomId, peerUserName }: ChatActionSheetProps,
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
    showActionAlert(`${peerUserName}님을 차단하시나요?`, "차단", async () => {
      if (!blockedId) return;
      try {
        await postUserBlock(blockedId);
        showAlert(`이제 ${peerUserName}님과 \n 대화를 할 수 없어요`, () => {
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
            showAlert(e.response.data.message || "다시 시도해 주세요");
            return;
          }
        }
      }
    );
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
