// app/components/chat/GiftedChatView.tsx

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
  MessageProps,
  InputToolbarProps,
} from "react-native-gifted-chat";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinner from "../common/LoadingSpinner";
import { useRouter } from "expo-router";

// GiftedChat의 타입 한계로 인해 ref를 직접 전달하기 위해 any로 캐스팅한 래퍼 컴포넌트를 사용합니다.
const GiftedChatAny: any = GiftedChat as any;

/**
 * 말풍선(Bubble) 관련 정적 스타일 객체입니다.
 * 컴포넌트 외부에 선언하여 리렌더링 시 불필요하게 객체가 재생성되는 것을 방지합니다. (성능 최적화)
 */
const BUBBLE_STYLES = {
  // 말풍선 자체의 스타일
  wrapperStyle: {
    // 내가 보낸 메시지 말풍선
    right: {
      backgroundColor: "#FF6B3E",
      padding: 5,
      marginLeft: 0,
      marginRight: 0,
    },
    // 상대방이 보낸 메시지 말풍선
    left: {
      backgroundColor: "#f2f2f7",
      padding: 5,
      marginLeft: 0,
      marginRight: 0,
    },
  },
  // 말풍선 안의 텍스트 스타일
  textStyle: {
    right: { color: "#ffffff" },
    left: { color: "#111111" },
  },
  // 말풍선과 텍스트를 감싸는 컨테이너의 스타일 (주로 너비 제한 용도)
  containerStyle: {
    right: { flex: 0, maxWidth: "78%" },
    left: { flex: 0, maxWidth: "78%" },
  },
} as const;

/**
 * GiftedChatView 컴포넌트가 받는 props의 타입 정의입니다.
 */
export type GiftedChatViewProps = {
  // 채팅 메시지 배열
  messages: IMessage[];
  // 메시지 전송 시 호출될 콜백 함수
  onSend: (newMessages?: IMessage[]) => void;
  // 현재 로그인한 사용자 정보
  currentUser: { _id: string | number };
  // 메시지 입력창의 플레이스홀더 텍스트
  placeholder?: string;
  // 이전 메시지를 불러올 때 호출될 콜백 함수
  onLoadEarlier?: () => void;
  // 더 불러올 이전 메시지가 있는지 여부
  canLoadEarlier?: boolean;
  // 이전 메시지를 로딩 중인지 여부
  isLoadingEarlier?: boolean;
  // 상대방이 채팅방을 나갔는지 여부
  isLeaveUser?: boolean;
  // 상대방을 차단했는지 여부
  isBlockedUser?: boolean;
  // 나간 상대방의 닉네임 (시스템 메시지에 사용)
  leaveUserName?: string;
  // 스크롤 위치 유지 등 FlatList 관련 추가 props
  listViewProps?: any;
  renderInputToolbar?: (props: InputToolbarProps<IMessage>) => React.ReactNode;
  // 한글 주석: 상대 유저 정보(아이디/닉네임)를 상위에서 주입
  opponent?: { id: number | string; nickname?: string };
};

/**
 * '소람' 앱의 디자인 시스템에 맞춰 GiftedChat UI를 커스터마이징한 공용 채팅 컴포넌트입니다.
 */
const GiftedChatView = ({
  messages,
  onSend,
  currentUser,
  placeholder,
  onLoadEarlier,
  canLoadEarlier,
  isLoadingEarlier,
  isLeaveUser,
  isBlockedUser,
  leaveUserName,
  listViewProps,
  renderInputToolbar,
  opponent,
}: GiftedChatViewProps) => {
  // GiftedChat의 내부 FlatList에 접근하기 위한 ref
  const chatRef = useRef<any>(null);
  const router = useRouter();
  // '읽음'을 표시할 단 하나의 메시지 ID를 결정하는 최종 로직
  const messageIdToShowReceipt = useMemo(() => {
    // 내가 보낸 마지막 읽힌 메시지를 찾습니다.
    const lastMyReadMessage = messages.find(
      (m) => m.user._id === currentUser._id && m.isRead
    );
    // 상대방이 보낸 마지막 메시지를 찾습니다.
    const lastOpponentMessage = messages.find(
      (m) => m.user._id !== currentUser._id
    );

    // 내가 보낸 읽힌 메시지가 없으면 '읽음'을 표시할 필요가 없습니다.
    if (!lastMyReadMessage) {
      return null;
    }

    // 상대방이 보낸 메시지가 아예 없거나,
    // 내가 보낸 마지막 읽힌 메시지가 상대방의 마지막 메시지보다 최신인 경우에만 '읽음'을 표시합니다.
    if (
      !lastOpponentMessage ||
      new Date(lastMyReadMessage.createdAt) >
        new Date(lastOpponentMessage.createdAt)
    ) {
      return lastMyReadMessage._id;
    }

    // 그 외의 경우 (상대방이 더 최신 메시지를 보낸 경우)에는 '읽음'을 표시하지 않습니다.
    return null;
  }, [messages, currentUser._id]);

  /**
   * 메시지 생성 시간을 '오전/오후 HH:MM' 형식으로 변환하는 함수입니다.
   */
  const formatTimeLabel = useCallback((date?: Date | number | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const handleAvatarPress = useCallback(() => {
    router.push({
      pathname: "/profile/[userId]",
      params: { userId: String(opponent?.id), nickname: opponent?.nickname },
    });
  }, [opponent?.id, opponent?.nickname]);

  /**
   * 각 메시지 말풍선을 어떻게 렌더링할지 정의하는 함수입니다.
   * 말풍선, 아바타, 시간 표시 여부 등 상세한 UI 로직을 포함합니다.
   */
  const renderMessage = useCallback(
    (props: MessageProps<IMessage>) => {
      const current = props?.currentMessage;
      if (!current) return <View />;

      const isMe = current.user?._id === currentUser._id;
      const timeText = formatTimeLabel(current.createdAt);

      const nextMsg = props?.nextMessage;
      const toMinute = (d?: Date | number | string) =>
        d ? Math.floor(new Date(d).getTime() / 60000) : NaN;

      const isSameUser = nextMsg && nextMsg.user?._id === current.user?._id;
      const isSameMinute =
        nextMsg && toMinute(nextMsg.createdAt) === toMinute(current.createdAt);
      const showTime = !(isSameUser && isSameMinute);

      const previousMessage = props.previousMessage;
      const isContinuous =
        previousMessage &&
        previousMessage.user?._id === current.user?._id &&
        toMinute(previousMessage.createdAt) === toMinute(current.createdAt);

      const showAvatar = !isMe && !isContinuous;

      // 현재 메시지가 '읽음'을 표시해야 할 바로 그 메시지인지 확인합니다.
      const shouldShowReadReceipt = current._id === messageIdToShowReceipt;

      return (
        <View style={styles.messageRowContainer}>
          {isMe ? (
            // 내가 보낸 메시지 UI (우측 정렬)
            <View style={styles.myMessageWrapper}>
              <View style={styles.rightStatusContainer}>
                {shouldShowReadReceipt && showTime && (
                  <Text style={styles.readReceiptText}>읽음</Text>
                )}
                {showTime && <Text style={styles.timeText}>{timeText}</Text>}
              </View>
              <Bubble
                {...props}
                renderTime={() => null}
                wrapperStyle={BUBBLE_STYLES.wrapperStyle}
                textStyle={BUBBLE_STYLES.textStyle}
                containerStyle={BUBBLE_STYLES.containerStyle}
              />
            </View>
          ) : (
            // 상대방이 보낸 메시지 UI (좌측 정렬)
            <View style={styles.peerMessageWrapper}>
              {showAvatar ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.avatar}
                  onPress={handleAvatarPress}
                >
                  <Ionicons name="person" size={16} color="#fff" />
                </TouchableOpacity>
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
              <Bubble
                {...props}
                renderTime={() => null}
                wrapperStyle={BUBBLE_STYLES.wrapperStyle}
                textStyle={BUBBLE_STYLES.textStyle}
                containerStyle={BUBBLE_STYLES.containerStyle}
              />
              {showTime && <Text style={styles.timeText}>{timeText}</Text>}
            </View>
          )}
        </View>
      );
    },
    [currentUser._id, formatTimeLabel, messageIdToShowReceipt]
  );
  /**
   * 시스템 메시지(예: 'OO님이 나갔습니다')를 렌더링하는 함수입니다.
   */
  const renderSystemMessage = useCallback((props: any) => {
    const text = props?.currentMessage?.text ?? "";
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>{text}</Text>
      </View>
    );
  }, []);

  /**
   * 원본 메시지 배열에 조건부로 시스템 메시지를 추가하여 가공하는 로직입니다.
   * useMemo를 사용하여 불필요한 재연산을 방지합니다.
   */
  const decoratedMessages = useMemo(() => {
    // 상대방이 나갔거나, 내가 상대방을 차단한 경우
    const isPeerGone = !!isLeaveUser || !!isBlockedUser;
    if (!isPeerGone) return messages;
    const alreadyHasSystemMessage = messages.some(
      (m) => m.system && m._id === "system-leave"
    );
    if (alreadyHasSystemMessage) return messages;

    // 시스템 메시지에 표시될 상대방 닉네임 설정
    const name = leaveUserName ?? "상대방";
    // 시스템 메시지 객체 생성
    const sysMsg: IMessage = {
      _id: "system-leave", // 고유 ID로 중복 확인에 사용
      text: `${name}님이 채팅방을 나갔습니다`,
      createdAt: new Date(),
      system: true, // 시스템 메시지임을 명시
      user: { _id: "system" }, // 시스템 메시지용 가상 유저
    };

    // 가장 마지막에 보이도록 원본 메시지 배열 뒤에 시스템 메시지를 추가하여 반환합니다.
    return [...messages, sysMsg];
  }, [messages, isLeaveUser, isBlockedUser, leaveUserName]);

  /**
   * 날짜가 바뀔 때 표시되는 날짜 구분선(Day) UI를 커스터마이징하는 함수입니다.
   */
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
    const label = `${yyyy}년 ${mm}월 ${dd}일 ${dayName}`;

    return (
      <View style={styles.dayContainer}>
        <Ionicons name="calendar-outline" size={14} color="#6B7280" />
        <AppText style={styles.dayText}>{label}</AppText>
      </View>
    );
  }, []);

  /**
   * 메시지 입력창과 전송 버튼을 감싸는 툴바의 UI를 커스터마이징하는 함수입니다.
   * 이 함수는 외부에서 renderInputToolbar prop이 제공되지 않았을 때의 기본값으로 사용
   */
  const internalRenderInputToolbar = useCallback(
    // 3. [수정] 함수 이름을 변경하여 외부 prop과 충돌하지 않도록 합니다.
    (props: InputToolbarProps<IMessage>) => {
      return (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbarContainer} // 상단 경계선 제거 등 스타일 적용
        />
      );
    },
    []
  );

  /**
   * 텍스트를 입력하는 Composer(TextInput) UI를 커스터마이징하는 함수입니다.
   */
  const renderComposer = (props: any) => (
    <TextInput
      testID={props.placeholder}
      accessible
      accessibilityLabel={props.placeholder}
      placeholder={props.placeholder}
      placeholderTextColor="#B0A6A0"
      multiline
      editable={!props.disableComposer} // 상대방이 나간 경우 등 입력 비활성화
      onChangeText={props.onTextChanged}
      style={styles.composer} // 배경색, 둥근 모서리 등 스타일 적용
      autoFocus={false}
      value={props.text}
      enablesReturnKeyAutomatically
      underlineColorAndroid="transparent"
      keyboardAppearance="default"
      {...props.textInputProps}
    />
  );

  /**
   * 메시지 전송 시 스크롤을 최하단으로 이동시키는 로직을 포함한 onSend 래퍼 함수입니다.
   */
  const handleSendWithScroll = useCallback(
    (msgs?: IMessage[]) => {
      onSend(msgs);
      // 다음 렌더링 프레임에서 스크롤을 이동시켜 UI 업데이트 후 자연스럽게 동작하도록 합니다.
      requestAnimationFrame(() => {
        chatRef.current?.scrollToBottom?.();
      });
    },
    [onSend]
  );

  /**
   * '이전 메시지 불러오기' UI를 커스터마이징하는 함수입니다.
   */
  const renderLoadEarlier = useCallback(() => {
    // 더 불러올 메시지가 없으면 아무것도 렌더링하지 않습니다.
    if (!canLoadEarlier) return null;
    return (
      <View style={{ paddingVertical: 12, alignItems: "center" }}>
        {/* 로딩 중일 때만 스피너를 표시합니다. */}
        {isLoadingEarlier ? <LoadingSpinner color="#FF7D4A" /> : null}
      </View>
    );
  }, [canLoadEarlier, isLoadingEarlier]);

  // 최종적으로 커스터마이징된 props들을 적용하여 GiftedChat 컴포넌트를 렌더링합니다.
  const finalPlaceholder = useMemo(
    () =>
      placeholder ??
      (opponent?.nickname ? `${opponent.nickname}에게 메시지` : "메시지 입력"),
    [placeholder, opponent?.nickname]
  );
  return (
    <GiftedChatAny
      ref={chatRef}
      messages={decoratedMessages}
      onSend={handleSendWithScroll}
      user={currentUser}
      placeholder={finalPlaceholder}
      alwaysShowSend // 입력 내용이 없어도 전송 버튼 영역을 항상 표시
      inverted={true} // 채팅 목록을 아래부터 위로 쌓음 (기본값)
      loadEarlier={!!canLoadEarlier}
      isLoadingEarlier={!!isLoadingEarlier}
      onLoadEarlier={onLoadEarlier}
      // ----------------------------------------
      // UI 커스터마이징을 위한 render 함수들
      // ----------------------------------------
      renderLoadEarlier={renderLoadEarlier}
      renderMessage={renderMessage}
      renderSystemMessage={renderSystemMessage}
      renderDay={renderDay}
      // 4. [수정] 외부에서 받은 renderInputToolbar가 있으면 그것을 사용하고,
      // 없으면 내부 기본 툴바를 사용하도록 조건부 로직을 적용합니다.
      renderInputToolbar={renderInputToolbar || internalRenderInputToolbar}
      renderComposer={renderComposer}
      listViewProps={listViewProps}
      // 전송 버튼 UI 커스터마이징
      renderSend={(props: any) => {
        const canSend = !!props.text?.trim(); // 입력된 텍스트가 있을 때만 활성화
        return (
          <TouchableOpacity
            onPress={() => props.onSend?.({ text: props.text!.trim() }, true)}
            disabled={!canSend}
            style={[styles.sendButton, { opacity: canSend ? 1 : 0.4 }]}
          >
            <Ionicons name="send" size={25} color="#FF7D4A" />
          </TouchableOpacity>
        );
      }}
    />
  );
};

// 컴포넌트에서 사용하는 스타일 시트
const styles = StyleSheet.create({
  // 날짜 구분선 컨테이너
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0ff",
    borderRadius: 16,
    alignSelf: "center",
    marginVertical: 10,
  },
  // 날짜 구분선 텍스트
  dayText: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "bold",
  },
  // 상대방 아바타
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFD6C9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginVertical: 5,
  },
  // 연속 메시지일 때 아바타 자리를 차지하여 레이아웃을 유지하는 플레이스홀더
  avatarPlaceholder: {
    width: 32,
    marginRight: 6,
  },
  // 좌/우 시간 텍스트 스타일을 하나로 통합합니다.
  timeText: {
    color: "#B0A6A0",
    fontSize: 10,
  },
  // '읽음' 텍스트와 시간을 감싸는 컨테이너 스타일 (내가 보낸 메시지용)
  rightStatusContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 5,
    marginBottom: 2,
  },
  // '읽음' 텍스트 스타일
  readReceiptText: {
    color: "#FF6B3E", // 서비스 메인 컬러와 통일
    fontSize: 10,
    fontWeight: "bold",
  },
  // 시스템 메시지 컨테이너
  systemMessageContainer: {
    paddingVertical: 8,
    alignItems: "center",
  },
  // 시스템 메시지 텍스트
  systemMessageText: {
    color: "#8E8E93",
    fontSize: 12,
  },
  // 입력 툴바 컨테이너
  inputToolbarContainer: {
    borderTopWidth: 0,
    paddingHorizontal: 10,
  },
  // 메시지 입력창
  composer: {
    flex: 1,
    minHeight: 40,
    backgroundColor: "#f2f2f7",
    borderRadius: 20,
    padding: 12,
    textAlignVertical: "center",
  },
  // 전송 버튼
  sendButton: {
    paddingVertical: 10,
    paddingLeft: 10,
    marginHorizontal: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  // ✨ [추가] 새로운 스타일들을 추가합니다.
  messageRowContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  myMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  peerMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
});

export default GiftedChatView;
