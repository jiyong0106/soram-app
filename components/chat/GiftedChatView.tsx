import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
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

// GiftedChat 래퍼 컴포넌트
// - 목적: 메시지 정렬(위→아래), 시간 라벨 배치, 시스템 메시지 표현 일관화
// - 주의: 상위에서 messages는 오름차순 제공 권장. 아니면 내부에서 정렬합니다.

export type GiftedChatViewProps = {
  messages: IMessage[];
  onSend: (newMessages?: IMessage[]) => void;
  currentUser: { _id: string | number };
  placeholder?: string;
  onLoadEarlier?: () => void;
  canLoadEarlier?: boolean;
  isLoadingEarlier?: boolean;
};

const GiftedChatView = ({
  messages,
  onSend,
  currentUser,
  placeholder = "메시지 입력",
  onLoadEarlier,
  canLoadEarlier,
  isLoadingEarlier,
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
          backgroundColor: "#ff6b6b",
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
                  style={{ color: "#8E8E93", fontSize: 12, marginRight: 4 }}
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
                <Text style={{ color: "#8E8E93", fontSize: 12, marginLeft: 4 }}>
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

  // Day(날짜 배지) 포맷: YYYY-MM-DD
  const renderDay = useCallback((props: any) => {
    const createdAt = props?.createdAt ?? props?.currentMessage?.createdAt;
    const d = createdAt ? new Date(createdAt) : undefined;
    const yyyy = d?.getFullYear();
    const mm = d ? String(d.getMonth() + 1).padStart(2, "0") : "";
    const dd = d ? String(d.getDate()).padStart(2, "0") : "";
    const label = d ? `${yyyy}-${mm}-${dd}` : "";
    return (
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 3,
          backgroundColor: "#E5E7EB",
          borderRadius: 16,
          width: "30%",
          alignSelf: "center",
          marginVertical: 30,
        }}
      >
        <AppText
          style={{
            color: "#6B7280",
            fontSize: 11,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {label}
        </AppText>
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
      placeholderTextColor = "#b2b2b2",
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
            padding: 10,
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

  const renderLoadEarlier = useCallback(() => {
    if (!canLoadEarlier) return null; // 더 불러올 게 없으면 아무것도 안 보임
    return (
      <View style={{ paddingVertical: 12, alignItems: "center" }}>
        {isLoadingEarlier ? <LoadingSpinner color="#ff6b6b" /> : null}
      </View>
    );
  }, [canLoadEarlier, isLoadingEarlier]);

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={currentUser}
      placeholder={placeholder}
      alwaysShowSend
      inverted={false}
      // 이전 기록 로딩
      loadEarlier={!!canLoadEarlier}
      isLoadingEarlier={!!isLoadingEarlier}
      onLoadEarlier={onLoadEarlier}
      renderLoadEarlier={renderLoadEarlier}
      // 위로 스크롤 시 임계점에서 자동 로드
      handleOnScroll={(e: any) => {
        try {
          const y = e?.contentOffset?.y ?? e?.nativeEvent?.contentOffset?.y;
          if (y != null && y < 48 && canLoadEarlier && !isLoadingEarlier) {
            onLoadEarlier?.();
          }
        } catch {}
      }}
      listViewProps={{
        // iOS에서 스크롤 위치 보존 지원 (플랫폼별 동작 상이할 수 있음)
        // @ts-ignore
        maintainVisibleContentPosition: { minIndexForVisible: 1 },
      }}
      renderMessage={renderMessage}
      renderSystemMessage={renderSystemMessage}
      renderDay={renderDay}
      renderInputToolbar={renderInputToolbar}
      renderComposer={renderComposer}
      renderSend={(props) => {
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
            }}
          >
            <Ionicons name="send" size={25} color="#ff6b6b" />
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default GiftedChatView;

//renderActions
//=> 메시지 입력 영역 왼쪽에 버튼 추가
