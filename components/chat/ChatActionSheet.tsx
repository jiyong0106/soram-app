import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import SheetRow from "@/components/common/SheetRow";
import useAlert from "@/utils/hooks/useAlert";
import { postChatLeave, postUserBlock } from "@/utils/api/chatPageApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { GetChatResponse } from "@/utils/types/chat";
import {
  deleteConnectionMute,
  postConnectionMute,
} from "@/utils/api/connectionPageApi";

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
  // 로컬 상태로 즉시 라벨/아이콘 반영
  const [isMutedLocal, setIsMutedLocal] = useState<boolean | undefined>(
    undefined
  );

  const dismiss = () => (ref as any)?.current?.dismiss?.();

  // 마운트/roomId 변경 시 캐시에서 초기 isMuted 파생
  useEffect(() => {
    const list = qc.getQueryData<InfiniteData<GetChatResponse>>(["getChatKey"]);
    if (!list) return;
    for (const page of list.pages) {
      const found = page.data.find((it) => it.id === roomId);
      if (found) {
        setIsMutedLocal(Boolean(found.isMuted));
        break;
      }
    }
  }, [qc, roomId]);

  const onReport = () => {
    dismiss();
    setTimeout(() => {
      router.push({ pathname: "/chat/report", params: { peerUserId } });
    }, 300);
  };

  const onBlock = () => {
    dismiss();
    showActionAlert(
      `차단하시겠습니까?\n\n앞으로 모든 콘텐츠에서\n\n${peerUserName}님과 상호작용할 수 없습니다.\n\n[더보기] - [계정]에서\n언제든 차단을 해제할 수 있어요.`,
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
      `대화방을 나가시겠어요?\n\n해당 주제로는\n\n더 이상 대화하실 수 없어요`,
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

  const onMute = () => {
    // 시트 닫기
    dismiss();

    // 캐시에서 현재 방의 isMuted 파생
    const list = qc.getQueryData<InfiniteData<GetChatResponse>>(["getChatKey"]);
    let currentIsMuted: boolean | undefined = undefined;
    if (list) {
      outer: for (const page of list.pages) {
        for (const it of page.data) {
          if (it.id === roomId) {
            currentIsMuted = it.isMuted;
            break outer;
          }
        }
      }
    }

    // 파생값이 없으면 기본 false로 간주하고, 목표 상태는 토글 결과
    const targetMute = !(currentIsMuted ?? false);

    // 낙관적 업데이트로 즉시 UI 반영
    qc.setQueryData(
      ["getChatKey"],
      (oldData: InfiniteData<GetChatResponse> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id === roomId ? { ...item, isMuted: targetMute } : item
            ),
          })),
        };
      }
    );
    // 로컬 상태도 함께 갱신하여 즉시 리렌더
    setIsMutedLocal(targetMute);

    // 실제 API 호출 (백그라운드)
    (async () => {
      try {
        if (targetMute) {
          await postConnectionMute(roomId);
        } else {
          await deleteConnectionMute(roomId);
        }
        await qc.invalidateQueries({ queryKey: ["getChatKey"] });
      } catch (e: any) {
        showAlert(e?.response?.data?.message || "다시 시도해 주세요");
        await qc.invalidateQueries({ queryKey: ["getChatKey"] });
      }
    })();
  };

  return (
    <AppBottomSheetModal ref={ref} snapPoints={snapPoints}>
      <View style={s.container}>
        {/* Group: 유틸 */}
        <View style={s.group}>
          {(() => {
            // 현재 상태 파생(렌더 타이밍에서 한 번 더 계산)
            const list = qc.getQueryData<InfiniteData<GetChatResponse>>([
              "getChatKey",
            ]);
            let isMutedDerived = isMutedLocal;
            if (list && isMutedDerived == null) {
              outer: for (const page of list.pages) {
                for (const it of page.data) {
                  if (it.id === roomId) {
                    isMutedDerived = Boolean(it.isMuted);
                    break outer;
                  }
                }
              }
            }
            const label = isMutedDerived ? "알림 켜기" : "알림 끄기";
            const iconName = isMutedDerived
              ? "notifications"
              : "notifications-off-outline";
            return (
              <SheetRow
                icon={
                  <Ionicons name={iconName} size={18} color={COLORS.icon} />
                }
                label={label}
                onPress={onMute}
              />
            );
          })()}
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
            labelStyle={{ color: COLORS.danger }}
          />
        </View>
        <View style={s.group}>
          <SheetRow
            icon={
              <Ionicons name="exit-outline" size={18} color={COLORS.danger} />
            }
            label="대화방 나가기"
            onPress={onLeave}
            labelStyle={{ color: COLORS.danger }}
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
