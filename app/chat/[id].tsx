import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View, Text, Keyboard, Platform } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "@/components/common/PageContainer";
import StickyBottom from "@/components/common/StickyBottom";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import useSafeArea from "@/utils/hooks/useSafeArea";
import ChatActionSheet from "@/components/chat/ChatActionSheet";
import { BackButton } from "@/components/common/backbutton";
import { getAuthToken } from "@/utils/util/auth";
import MessageInputBar from "@/components/chat/MessageInputBar";
import MessageList from "@/components/chat/MessageList";
import { getSocket } from "@/utils/libs/getSocket";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT ";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { ChatMessageType } from "@/utils/types/chat";
import { useChat } from "@/utils/hooks/useChat";

const ChatIdPage = () => {
  const { id, peerUserId, peerUserName } = useLocalSearchParams<{
    id: string;
    peerUserId: string;
    peerUserName: string;
  }>();

  const roomId = Number(id);
  const blockedId = Number(peerUserId);
  const token = getAuthToken() ?? "";

  const [text, setText] = useState("");
  const [inputBarHeight, setInputBarHeight] = useState(40);
  const { height } = useReanimatedKeyboardAnimation();
  const { bottom } = useSafeArea();
  const actionSheetRef = useRef<any>(null);

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

  const animatedListStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: height.value }],
  }));

  const onSend = () => {
    const msg = text.trim();
    if (!msg || !token) return;
    sendMessage(msg);
    setText("");
  };

  return (
    <PageContainer edges={[]} padded={false}>
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

      <View style={{ flex: 1 }}>
        <Animated.View style={[{ flex: 1 }, animatedListStyle]}>
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
            paddingBottom={bottom}
          />
        </Animated.View>

        <StickyBottom
          style={{ backgroundColor: "#fff" }}
          onHeightChange={(h) => setInputBarHeight(h)}
          bottomInset={bottom}
        >
          <MessageInputBar
            value={text}
            onChangeText={setText}
            onSend={onSend}
          />
        </StickyBottom>

        <ChatActionSheet ref={actionSheetRef} blockedId={blockedId} />
      </View>
    </PageContainer>
  );
};

export default ChatIdPage;
