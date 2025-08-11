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
import { Message, SAMPLE_MESSAGES } from "@/dummy/test";

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
