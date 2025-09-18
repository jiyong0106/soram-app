// react-native-gifted-chat 더미 데이터
// - 목적: GiftedChat 컴포넌트 UI 테스트용
// - 주의: 실제 API 연동 전까지 임시로 사용

import type { IMessage, User } from "react-native-gifted-chat";

// 현재 사용자(나)
export const giftedChatCurrentUser: User = {
  _id: "me",
  name: "나",
  avatar: "https://placekitten.com/200/200",
};

// 상대 사용자
export const giftedChatPeerUser: User = {
  _id: "peer-1",
  name: "상대",
  avatar: "https://placekitten.com/201/201",
};

// GiftedChat 메시지 더미 목록
export const giftedChatDummyMessages: IMessage[] = [
  {
    _id: "sys-1",
    text: "채팅방이 생성되었어요",
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
    system: true,
    // 타입 요구사항을 만족하기 위해 시스템 메시지도 user 필드를 포함
    user: {
      _id: "system",
      name: "시스템",
      avatar: "https://placehold.co/100x100?text=SYS",
    },
  },
  {
    _id: "m-2",
    text: "반가워요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 49), // 49분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-3",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 48), // 48분 전
    user: giftedChatPeerUser,
  },
  {
    _id: "m-4",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 40), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-5",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-6",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 32), // 48분 전
    user: giftedChatPeerUser,
  },
  {
    _id: "m-7",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-8",
    text: "템플릿/버튼도 커스텀 가능합니다.템플릿/버튼도 커스텀 가능합니다.템플릿/버튼도 커스텀 가능합니다.템플릿/버튼도 커스텀 가능합니다.템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 48분 전
    user: giftedChatPeerUser,
  },
  {
    _id: "m-9",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-10",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 19), // 48분 전
    user: giftedChatPeerUser,
  },
  {
    _id: "m-11",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 19), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-12",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-13",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 16), // 48분 전
    user: giftedChatPeerUser,
  },
  {
    _id: "m-14",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 48분 전
    user: giftedChatCurrentUser,
  },
  {
    _id: "m-15",
    text: "템플릿/버튼도 커스텀 가능합니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 48분 전
    user: giftedChatPeerUser,
  },
];

// 새 텍스트 메시지 생성 헬퍼
export function createTextMessage(text: string, fromUser: User): IMessage {
  // _id는 GiftedChat 리스트 성능과 중복 방지를 위해 반드시 고유해야 함
  return {
    _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    createdAt: new Date(),
    user: fromUser,
  };
}
