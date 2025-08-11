import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInputBar from "@/components/chat/MessageInputBar";
import PageContainer from "@/components/common/PageContainer";
import StickyBottom from "@/components/common/StickyBottom";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import useSafeArea from "@/hooks/useSafeArea";

type Message = {
  id: string;
  text: string;
  isMine: boolean;
};

const SAMPLE_MESSAGES: Message[] = [
  { id: "1", text: "가나다라마", isMine: false },
  { id: "2", text: "가나다라마", isMine: true },
  {
    id: "3",
    text: "김하성은 11일 시애틀 매리너스와김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다. 시애틀의 우완 에이스 브라이언 우의 싱커를 공략해 좌익수 방면 1타점 2루타를 터트렸다.이어 4회 2사 주자 없는 상황에서 맞은 두번째 타석. 우의 155km 초구를 정확히 공략해 좌측 담장을 그대로 넘어가는 시즌 2호 솔로 홈런을 터트렸다. 타구속도가 165km에 달하는 강한 타구였다. 김하성은 부상 복귀 이후 네 번째 경기였던 지난달 11일 보스턴 레드삭스전에서 템파베이 이적 후 첫 홈런을 기록한 뒤 정확히 한 달만에 2호 홈런을 터트렸다.",
    isMine: true,
  },
  { id: "4", text: "가나다라마", isMine: false },
  { id: "5", text: "가나다라가나다라마", isMine: true },
  { id: "7", text: "가나다라마", isMine: false },
  { id: "8", text: "가나다라마", isMine: false },
  {
    id: "9",
    text: "김하성은 11일 시애틀 매리너스와김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 김하성은 11일 시애틀 매리너스와의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 의 원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다.원정 경기에서 7번 타자 유격수로 선발 출전해 0-4로 팀이 지고 있던 2회 1사 2루에서 맞은 첫 타석에 섰다. 시애틀의 우완 에이스 브라이언 우의 싱커를 공략해 좌익수 방면 1타점 2루타를 터트렸다.이어 4회 2사 주자 없는 상황에서 맞은 두번째 타석. 우의 155km 초구를 정확히 공략해 좌측 담장을 그대로 넘어가는 시즌 2호 솔로 홈런을 터트렸다. 타구속도가 165km에 달하는 강한 타구였다. 김하성은 부상 복귀 이후 네 번째 경기였던 지난달 11일 보스턴 레드삭스전에서 템파베이 이적 후 첫 홈런을 기록한 뒤 정확히 한 달만에 2호 홈런을 터트렸다.",
    isMine: false,
  },
  { id: "10", text: "가나다라마", isMine: true },
  { id: "11", text: "가나다라마", isMine: true },
  { id: "12", text: "가나다라마", isMine: false },
  { id: "13", text: "가나다라마", isMine: true },
  { id: "14", text: "가나다라마", isMine: false },
  { id: "16", text: "가나다라마", isMine: true },
];

const ChatDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  //채팅 유저의 id
  const [text, setText] = useState("");
  const [messages] = useState<Message[]>(SAMPLE_MESSAGES);
  const flatListRef = useRef<FlatList<Message>>(null);
  const [inputBarHeight, setInputBarHeight] = useState(40);
  const { height } = useReanimatedKeyboardAnimation();
  const { bottom } = useSafeArea();

  const animatedListStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: height.value }] };
  });

  const headerTitle = useMemo(() => "가나다라마바사", [id]);

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble text={item.text} isMine={item.isMine} />
  );

  const onSend = () => {
    Alert.alert("메세지 전송");
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [inputBarHeight]);

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerShown: true,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Ionicons name="call-outline" size={22} />
              <Ionicons name="ellipsis-vertical" size={20} />
            </View>
          ),
        }}
      />

      <View style={{ flex: 1 }}>
        <Animated.View style={[{ flex: 1 }, animatedListStyle]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: bottom,
              gap: 12,
            }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: false });
            }}
          />
        </Animated.View>

        <StickyBottom
          style={{ backgroundColor: "white" }}
          onHeightChange={setInputBarHeight}
          bottomInset={bottom}
        >
          <MessageInputBar
            value={text}
            onChangeText={setText}
            onSend={onSend}
          />
        </StickyBottom>
      </View>
    </PageContainer>
  );
};

export default ChatDetailPage;

const styles = StyleSheet.create({});
