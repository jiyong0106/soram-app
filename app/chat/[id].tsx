// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { FlatList, TouchableOpacity, View, Text } from "react-native";
// import { Stack, useLocalSearchParams } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import MessageBubble from "@/components/chat/MessageBubble";
// import MessageInputBar from "@/components/chat/MessageInputBar";
// import PageContainer from "@/components/common/PageContainer";
// import StickyBottom from "@/components/common/StickyBottom";
// import Animated, { useAnimatedStyle } from "react-native-reanimated";
// import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
// import useSafeArea from "@/utils/hooks/useSafeArea";
// import ChatActionModal from "@/components/chat/ChatActionModal";
// import { BackButton } from "@/components/common/backbutton";
// import { getAuthToken } from "@/utils/util/auth";
// import { useChat } from "@/utils/hooks/useChat";
// import { getSocket } from "@/utils/libs/getSocket";
// import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT ";

// const ChatIdPage = () => {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const connectionId = Number(id);

//   // ✅ 토큰 가드: 없으면 훅 호출/소켓 연결 지연
//   const token = getAuthToken() ?? "";

//   const [text, setText] = useState("");
//   const flatListRef = useRef<FlatList<any>>(null);
//   const [inputBarHeight, setInputBarHeight] = useState(40);
//   const { height } = useReanimatedKeyboardAnimation();
//   const { bottom } = useSafeArea();
//   const actionModalRef = useRef<any>(null);
//   const myUserId = useMemo(() => getUserIdFromJWT(token), [token]); // ✅ 내 ID

//   // ✅ 훅 시그니처/반환 이름 맞춤: useChat(jwt, connectionId) → { messages, sendMessage }
//   const { messages, sendMessage } = useChat(token, connectionId);

//   // ✅ 룸 변경 시 리스트 초기화 (옵션이지만 UX에 유리)
//   useEffect(() => {
//     // connectionId가 바뀌면 스크롤/길이 로그 초기화
//     prevLenRef.current = 0;
//     flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
//   }, [connectionId]);

//   // ✅ 서버가 emit한 error 수신 (디버깅/알림용)
//   useEffect(() => {
//     const s = getSocket();
//     const onError = (e: any) => {
//       console.log("[page] socket error:", e);
//       // 필요시 토스트/Alert로 노출
//       // Alert.alert("채팅 오류", e?.message ?? "알 수 없는 오류");
//     };
//     s?.on("error", onError);
//     return () => {
//       s?.off("error", onError);
//     };
//   }, []);

//   const animatedListStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: height.value }],
//   }));

//   const headerTitle = useMemo(() => `채팅 #${connectionId}`, [connectionId]);

//   const onSend = () => {
//     if (!text.trim()) return;
//     if (!token) {
//       console.log("[page] no token, skip send");
//       return;
//     }
//     console.log("[page] onSend", { textLen: text.length });
//     sendMessage(text.trim());
//     setText("");
//   };

//   // 인풋바/키보드로 레이아웃 변할 때 즉시
//   useEffect(() => {
//     console.log(
//       "[page] inputBarHeight changed → scrollToEnd(false)",
//       inputBarHeight
//     );
//     flatListRef.current?.scrollToEnd({ animated: false });
//   }, [inputBarHeight]);

//   // 메시지 추가 시 부드럽게
//   const prevLenRef = useRef(0);
//   useEffect(() => {
//     const prev = prevLenRef.current;
//     const next = messages.length;
//     console.log("[page] messages length change", { prev, next });
//     if (next > prev) {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }
//     prevLenRef.current = next;
//   }, [messages.length]);

//   // ✅ 토큰 없을 때 간단한 가드 UI (선택)
//   if (!token) {
//     return (
//       <PageContainer edges={[]} padded={false}>
//         <Stack.Screen
//           options={{
//             title: headerTitle,
//             headerShown: true,
//             headerBackVisible: false,
//             headerLeft: () => <BackButton />,
//           }}
//         />
//         <View
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         >
//           <Text>로그인 토큰을 불러오는 중입니다…</Text>
//         </View>
//       </PageContainer>
//     );
//   }
//   console.log("messages==>", messages);
//   return (
//     <PageContainer edges={[]} padded={false}>
//       <Stack.Screen
//         options={{
//           title: headerTitle,
//           headerShown: true,
//           headerBackVisible: false,
//           headerRight: () => (
//             <View style={{ flexDirection: "row", gap: 16 }}>
//               <TouchableOpacity
//                 style={{ flexDirection: "row" }}
//                 activeOpacity={0.5}
//               >
//                 <Ionicons name="call-outline" size={22} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{ flexDirection: "row" }}
//                 activeOpacity={0.5}
//                 onPress={() => actionModalRef.current?.present?.()}
//               >
//                 <Ionicons name="ellipsis-vertical" size={22} />
//               </TouchableOpacity>
//             </View>
//           ),
//           headerLeft: () => <BackButton />,
//         }}
//       />

//       <View style={{ flex: 1 }}>
//         <Animated.View style={[{ flex: 1 }, animatedListStyle]}>
//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(m, i) => String(m.id ?? i)}
//             renderItem={({ item }) => {
//               const sender = item.senderId ?? item.sender?.id;
//               const isMine = myUserId != null && sender === myUserId; // ✅ 비교
//               return <MessageBubble item={item} isMine={isMine} />;
//             }}
//             keyboardShouldPersistTaps="handled"
//             contentContainerStyle={{
//               paddingHorizontal: 15,
//               paddingTop: 15,
//               paddingBottom: bottom,
//               gap: 3,
//             }}
//             showsVerticalScrollIndicator={false}
//           />
//         </Animated.View>

//         <StickyBottom
//           style={{ backgroundColor: "#fff" }}
//           onHeightChange={(h) => {
//             setInputBarHeight(h);
//           }}
//           bottomInset={bottom}
//         >
//           <MessageInputBar
//             value={text}
//             onChangeText={(t) => setText(t)}
//             onSend={onSend}
//           />
//         </StickyBottom>

//         <ChatActionModal
//           ref={actionModalRef}
//           onReport={() => console.log("[page] action: report")}
//           onBlock={() => console.log("[page] action: block")}
//           onLeave={() => console.log("[page] action: leave")}
//           onMute={() => console.log("[page] action: mute")}
//         />
//       </View>
//     </PageContainer>
//   );
// };

// export default ChatIdPage;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
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
  // const { liveMessages, sendMessage, reset } = useChatLive(token, roomId);
  const { messages, sendMessage } = useChat(token, roomId);

  // 방 변경 시 라이브 버퍼 초기화(선택)
  // useEffect(() => {
  //   reset();
  // }, [roomId]);

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

  const headerTitle = useMemo(() => `채팅 #${roomId}`, [roomId]);

  const onSend = () => {
    const msg = text.trim();
    if (!msg || !token) return;
    sendMessage(msg);
    setText("");
  };

  if (!token) {
    return (
      <PageContainer edges={[]} padded={false}>
        <Stack.Screen
          options={{
            title: headerTitle,
            headerShown: true,
            headerBackVisible: false,
            headerLeft: () => <BackButton />,
          }}
        />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>로그인 토큰을 불러오는 중입니다…</Text>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: headerTitle,
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
