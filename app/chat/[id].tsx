import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View, Text, Keyboard, Platform } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "@/components/common/PageContainer";
import StickyBottom from "@/components/common/StickyBottom";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import useSafeArea from "@/utils/hooks/useSafeArea";
import ChatActionModal from "@/components/chat/ChatActionModal";
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = Number(id);
  const token = getAuthToken() ?? "";

  const [text, setText] = useState("");
  const [inputBarHeight, setInputBarHeight] = useState(40);
  const { height } = useReanimatedKeyboardAnimation();
  const { bottom } = useSafeArea();
  const actionModalRef = useRef<any>(null);

  const myUserId = useMemo(() => getUserIdFromJWT(token), [token]);
  const [kbOpen, setKbOpen] = useState(false);

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

  // if (!token) {
  //   return (
  //     <PageContainer edges={[]} padded={false}>
  //       <Stack.Screen
  //         options={{
  //           title: "",
  //           headerShown: true,
  //           headerBackVisible: false,
  //           headerLeft: () => <BackButton />,
  //         }}
  //       />
  //       <View
  //         style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //       >
  //         <Text>로그인 토큰을 불러오는 중입니다…</Text>
  //       </View>
  //     </PageContainer>
  //   );
  // }
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKbOpen(true)
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKbOpen(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity activeOpacity={0.5}>
                <Ionicons name="call-outline" size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => actionModalRef.current?.present?.()}
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
            paddingBottom={kbOpen ? 0 : bottom}
          />
        </Animated.View>

        <StickyBottom
          onHeightChange={(h) => setInputBarHeight(h)}
          bottomInset={bottom}
        >
          <MessageInputBar
            value={text}
            onChangeText={setText}
            onSend={onSend}
          />
        </StickyBottom>

        <ChatActionModal
          ref={actionModalRef}
          onReport={() => console.log("[page] action: report")}
          onBlock={() => console.log("[page] action: block")}
          onLeave={() => console.log("[page] action: leave")}
          onMute={() => console.log("[page] action: mute")}
        />
      </View>
    </PageContainer>
  );
};

export default ChatIdPage;
