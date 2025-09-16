import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "@/components/common/PageContainer";
import Reanimated, { useAnimatedProps } from "react-native-reanimated";
import ChatActionSheet from "@/components/chat/ChatActionSheet";
import { BackButton } from "@/components/common/backbutton";
import { getAuthToken } from "@/utils/util/auth";
import MessageList from "@/components/chat/MessageList";
import { getSocket } from "@/utils/libs/getSocket";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT ";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { ChatMessageType } from "@/utils/types/chat";
import { useChat } from "@/utils/hooks/useChat";
import { useKeyboardAnimation } from "@/utils/hooks/useKeyboardAnimation";
import MessageInputBar from "@/components/chat/MessageInputBar";

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
  const ref = useRef<Reanimated.ScrollView>(null);
  const { height, onScroll, inset, offset } = useKeyboardAnimation();
  const [text, setText] = useState("");

  const myUserId = useMemo(() => getUserIdFromJWT(token), [token]);

  // 1) 이전 채팅

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
  const items: ChatMessageType[] =
    data?.pages.flatMap((item) => item.data) ?? [];

  // 2) 실시간
  const { messages, sendMessage } = useChat(token, roomId);

  // 소켓 에러 수신(선택)
  useEffect(() => {
    const s = getSocket();
    const onError = (e: any) => console.log("[page] socket error:", e);
    s?.on("error", onError);
    return () => {
      s?.off("error", onError);
    };
  }, [token]);

  const onSend = () => {
    const msg = text.trim();
    if (!msg || !token) return;
    sendMessage(msg);
    setText("");
  };

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollToEnd({ animated: false });
  }, []);

  const props = useAnimatedProps(() => ({
    contentInset: {
      bottom: inset.value,
    },
    contentOffset: {
      x: 0,
      y: offset.value,
    },
  }));

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
      <Reanimated.ScrollView
        ref={ref}
        // simulation of `automaticallyAdjustKeyboardInsets` behavior on RN < 0.73
        animatedProps={props}
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="interactive"
        testID="chat.scroll"
        onContentSizeChange={scrollToBottom}
        onScroll={onScroll}
      >
        <MessageList
          myUserId={myUserId}
          items={items}
          live={messages}
          onLoadMore={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          isFetchingNextPage={isFetchingNextPage}
          paddingBottom={20}
        />
      </Reanimated.ScrollView>
      <MessageInputBar
        value={text}
        onChangeText={setText}
        onSend={onSend}
        height={height}
      />
      <ChatActionSheet ref={actionSheetRef} blockedId={blockedId} />
    </PageContainer>
  );
};

export default ChatIdPage;
