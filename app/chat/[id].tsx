import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "@/components/common/PageContainer";
import ChatActionSheet from "@/components/chat/ChatActionSheet";
import { BackButton } from "@/components/common/backbutton";
import { getAuthToken } from "@/utils/util/auth";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT ";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { ChatMessageType } from "@/utils/types/chat";
import { useChat } from "@/utils/hooks/useChat";
import { IMessage } from "react-native-gifted-chat";
import GiftedChatView from "@/components/chat/GiftedChatView";

const ChatIdPage = () => {
  const { id, peerUserId, peerUserName } = useLocalSearchParams<{
    id: string;
    peerUserId: string;
    peerUserName: string;
  }>();

  const roomId = Number(id);
  const blockedId = Number(peerUserId);
  const token = getAuthToken() ?? "";

  const actionSheetRef = useRef<any>(null);

  const myUserId = useMemo(() => getUserIdFromJWT(token), [token]);

  // 1) 이전 채팅 이력
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["getMessagesKey", roomId],
      queryFn: ({ pageParam }) =>
        getMessages({
          connectionId: roomId,
          cursor: pageParam,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
      staleTime: 60 * 1000,
      placeholderData: keepPreviousData,
    });
  const historyItems: ChatMessageType[] =
    data?.pages.flatMap((item) => item.data) ?? [];

  // 2) 실시간 수신
  const { messages: realtimeItems, sendMessage } = useChat(token, roomId);

  // 서버 ChatMessageType -> GiftedChat IMessage 매핑
  const mapToIMessage = useCallback(
    (m: ChatMessageType): IMessage => ({
      _id: String(m.id),
      text: m.content ?? "",
      createdAt: new Date(m.createdAt),
      user: {
        _id: m.senderId,
        name: m.sender?.nickname,
      },
    }),
    []
  );

  // 이전 이력 + 실시간 합치기(중복 제거, 오름차순 정렬)
  const giftedMessages = useMemo(() => {
    const merged = [...historyItems, ...realtimeItems];
    const dedupMap = new Map<number, ChatMessageType>();
    for (const m of merged) dedupMap.set(m.id, m);
    const unique = Array.from(dedupMap.values());
    unique.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return unique.map(mapToIMessage);
  }, [historyItems, realtimeItems, mapToIMessage]);

  // GiftedChat onSend -> 소켓 전송만 수행(낙관적 추가는 서버 에코로 처리)
  const handleSendGifted = useCallback(
    (newMessages?: IMessage[]) => {
      const t = newMessages?.[0]?.text?.trim();
      if (!t) return;
      sendMessage(t);
    },
    [sendMessage]
  );

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: peerUserName,
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => actionSheetRef.current?.present?.()}
              >
                <Ionicons name="ellipsis-vertical" size={22} />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => <BackButton />,
        }}
      />
      <GiftedChatView
        messages={giftedMessages}
        onSend={handleSendGifted}
        currentUser={{ _id: myUserId ?? "me" }}
      />

      <ChatActionSheet ref={actionSheetRef} blockedId={blockedId} />
    </PageContainer>
  );
};

export default ChatIdPage;
