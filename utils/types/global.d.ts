// 기존 'react-native-gifted-chat' 모듈의 선언을 가져오기
import "react-native-gifted-chat";

// 'react-native-gifted-chat' 모듈의 선언을 확장
declare module "react-native-gifted-chat" {
  // IMessage 인터페이스에 isRead 속성을 추가
  interface IMessage {
    isRead?: boolean;
  }
}
