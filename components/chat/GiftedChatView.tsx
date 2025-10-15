import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  IMessage,
  InputToolbar,
} from "react-native-gifted-chat";
import type { MessageProps } from "react-native-gifted-chat";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinner from "../common/LoadingSpinner";

// 타입 한계상 ref 전달을 위해 any 캐스팅한 래퍼 사용
const GiftedChatAny: any = GiftedChat as any;

export type GiftedChatViewProps = {
  messages: IMessage[];
  onSend: (newMessages?: IMessage[]) => void;
  currentUser: { _id: string | number };
  placeholder?: string;
  onLoadEarlier?: () => void;
  canLoadEarlier?: boolean;
  isLoadingEarlier?: boolean;
  isLeaveUser?: boolean;
  isBlockedUser?: boolean;
  leaveUserName?: string; // 상대방 닉네임(선택)
  listViewProps?: any;
};

const GiftedChatView = ({
  messages,
  onSend,
  currentUser,
  placeholder = "메시지 입력",
  onLoadEarlier,
  canLoadEarlier,
  isLoadingEarlier,
  isLeaveUser,
  isBlockedUser,
  leaveUserName,
  // 변경점 2: props 객체에서 listViewProps를 추출합니다.
  listViewProps,
}: GiftedChatViewProps) => {
  // 시간 라벨 포맷터
  const formatTimeLabel = useCallback((date?: Date | number | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // 메시지 커스텀 렌더러: 시간 라벨을 말풍선 옆으로 배치
  const renderMessage = useCallback(
    (props: MessageProps<IMessage>) => {
      const current = props?.currentMessage as IMessage | undefined;
      if (!current) return <View />;
      if (current.system) {
        return (
          <View style={{ paddingVertical: 8, alignItems: "center" }}>
            <Text style={{ color: "#8E8E93", fontSize: 12 }}>
              {current.text}
            </Text>
          </View>
        );
      }
      const isMe = current.user?._id === currentUser._id;
      const timeText = formatTimeLabel(current.createdAt);

      // 같은 사용자·같은 분의 연속 메시지면 현재 메시지 시간은 숨김
      const nextMsg = props?.nextMessage as IMessage | undefined;
      const toMinute = (d?: Date | number | string) =>
        d ? Math.floor(new Date(d).getTime() / 60000) : NaN;
      const isSameUser = nextMsg && nextMsg.user?._id === current.user?._id;
      const isSameMinute =
        nextMsg && toMinute(nextMsg.createdAt) === toMinute(current.createdAt);
      const showTime = !(isSameUser && isSameMinute);

      const wrapperStyle = {
        right: {
          backgroundColor: "#FF6B3E",
          padding: 5,
          marginLeft: 0,
          marginRight: 0,
        },
        left: {
          backgroundColor: "#f2f2f7",
          padding: 5,
          marginLeft: 0,
          marginRight: 0,
        },
      } as const;

      const textStyle = {
        right: { color: "#ffffff" },
        left: { color: "#111111" },
      } as const;

      const containerStyle = {
        right: { flex: 0, maxWidth: "78%" },
        left: { flex: 0, maxWidth: "78%" },
      } as const;

      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: isMe ? "flex-end" : "flex-start",
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          {isMe ? (
            <>
              {showTime && (
                <Text
                  style={{
                    color: "#B0A6A0",
                    fontSize: 10,
                    marginRight: 5,
                    marginBottom: 2,
                  }}
                >
                  {timeText}
                </Text>
              )}
              <Bubble
                {...props}
                renderTime={() => null}
                wrapperStyle={wrapperStyle}
                textStyle={textStyle}
                containerStyle={containerStyle}
              />
            </>
          ) : (
            <>
              <Bubble
                {...props}
                renderTime={() => null}
                wrapperStyle={wrapperStyle}
                textStyle={textStyle}
                containerStyle={containerStyle}
              />
              {showTime && (
                <Text
                  style={{
                    color: "#B0A6A0",
                    fontSize: 10,
                    marginLeft: 5,
                    marginBottom: 2,
                  }}
                >
                  {timeText}
                </Text>
              )}
            </>
          )}
        </View>
      );
    },
    [currentUser._id, formatTimeLabel]
  );

  const renderSystemMessage = useCallback((props: any) => {
    const text = props?.currentMessage?.text ?? "";
    return (
      <View style={{ paddingVertical: 8, alignItems: "center" }}>
        <Text style={{ color: "#8E8E93", fontSize: 12 }}>{text}</Text>
      </View>
    );
  }, []);

  // 시스템 메시지(상대 퇴장 안내) 주입
  // - 한글 주석: isLeaveUser가 true이면 시스템 메시지를 1회만 추가
  const decoratedMessages = useMemo(() => {
    // 한글 주석: 상대 퇴장 또는 차단 시 시스템 메시지 1회만 표시
    const isPeerGone = !!isLeaveUser || !!isBlockedUser;
    if (!isPeerGone) return messages;
    const alreadyHas = messages.some(
      (m) => (m as any)?.system && (m as any)?._id === "system-leave"
    );
    if (alreadyHas) return messages;

    const name = leaveUserName ?? "상대방";
    const sysMsg: IMessage = {
      _id: "system-leave",
      text: `${name}님이 채팅방을 나갔습니다`,
      createdAt: new Date(),
      system: true,
      user: { _id: "system" as any },
    } as any;

    // 한글 주석: 최신 메시지로 노출되도록 배열 뒤에 추가
    return [...messages, sysMsg];
  }, [messages, isLeaveUser, isBlockedUser, leaveUserName]);

  // Day(날짜 배지) 포맷: YYYY-MM-DD
  const renderDay = useCallback((props: any) => {
    const createdAt = props?.createdAt ?? props?.currentMessage?.createdAt;
    if (!createdAt) return null;

    const d = new Date(createdAt);
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dayName = days[d.getDay()];

    // 최종 날짜 포맷은 그대로 유지합니다.
    const label = `${yyyy}년 ${mm}월 ${dd}일 ${dayName}`;

    return (
      // 1. 아이콘과 텍스트를 나란히 배치하기 위해 View 스타일을 수정합니다.
      <View style={styles.dayContainer}>
        {/* 2. Ionicons에서 달력 아이콘을 추가합니다. */}
        <Ionicons name="calendar-outline" size={14} color="#6B7280" />
        <AppText style={styles.dayText}>{label}</AppText>
      </View>
    );
  }, []);

  // 인풋바 컨테이너 커스텀(상단 보더 제거, 패딩 정리)
  const renderInputToolbar = useCallback((props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 0,
          paddingHorizontal: 10,
        }}
      />
    );
  }, []);

  // 왼쪽 액션 버튼(+)

  // 입력창 배경/라운드 적용
  const renderComposer = (props: any) => {
    const {
      placeholder = "메시지 입력",
      placeholderTextColor = "#B0A6A0",
      multiline = true,
      textInputAutoFocus = false,
      keyboardAppearance = "default",
      text = "",
      onTextChanged,
      textInputProps,
      textInputStyle,
      disableComposer = false,
    } = props;

    return (
      <TextInput
        testID={placeholder}
        accessible
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        editable={!disableComposer}
        onChangeText={onTextChanged}
        numberOfLines={6}
        style={[
          textInputStyle,
          {
            flex: 1,
            minHeight: 40,
            backgroundColor: "#f2f2f7",
            borderRadius: 20,
            padding: 12,
            textAlignVertical: "center",
          },
        ]}
        autoFocus={textInputAutoFocus}
        value={text}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        keyboardAppearance={keyboardAppearance}
        {...textInputProps}
      />
    );
  };

  // 전송 직후 최하단으로 스크롤
  const chatRef = useRef<any>(null);
  const handleSendWithScroll = useCallback(
    (msgs?: IMessage[]) => {
      onSend(msgs);
      requestAnimationFrame(() => {
        try {
          chatRef.current?.scrollToBottom?.();
        } catch {}
      });
    },
    [onSend]
  );

  const renderLoadEarlier = useCallback(() => {
    if (!canLoadEarlier) return null; // 더 불러올 게 없으면 아무것도 안 보임
    return (
      <View style={{ paddingVertical: 12, alignItems: "center" }}>
        {isLoadingEarlier ? <LoadingSpinner color="#FF7D4A" /> : null}
      </View>
    );
  }, [canLoadEarlier, isLoadingEarlier]);

  return (
    <GiftedChatAny
      ref={chatRef}
      messages={decoratedMessages}
      onSend={handleSendWithScroll}
      user={currentUser}
      placeholder={placeholder}
      alwaysShowSend
      inverted={true}
      loadEarlier={!!canLoadEarlier}
      isLoadingEarlier={!!isLoadingEarlier}
      onLoadEarlier={onLoadEarlier}
      renderLoadEarlier={renderLoadEarlier}
      // maintainVisibleContentPosition는 제거하여 전송 시 하단 고정이 자연스럽게 동작하도록 함
      renderMessage={renderMessage}
      renderSystemMessage={renderSystemMessage}
      renderDay={renderDay}
      renderInputToolbar={renderInputToolbar}
      renderComposer={renderComposer}
      // 받아온 listViewProps를 GiftedChat 컴포넌트에 그대로 전달
      listViewProps={listViewProps}
      renderSend={(props: any) => {
        const canSend = !!props.text?.trim();
        return (
          <TouchableOpacity
            onPress={() => props.onSend?.({ text: props.text!.trim() }, true)}
            disabled={!canSend}
            style={{
              opacity: canSend ? 1 : 0.4,
              paddingVertical: 10,
              paddingLeft: 10,
              marginHorizontal: "auto",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="send" size={25} color="#FF7D4A" />
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flexDirection: "row", // 아이콘과 텍스트를 가로로 나열
    alignItems: "center", // 세로 중앙 정렬
    justifyContent: "center", // 가로 중앙 정렬
    gap: 6, // 아이콘과 텍스트 사이 간격
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0ff",
    borderRadius: 16,
    alignSelf: "center",
    marginVertical: 10,
  },
  dayText: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default GiftedChatView;

//renderActions
//=> 메시지 입력 영역 왼쪽에 버튼 추가
