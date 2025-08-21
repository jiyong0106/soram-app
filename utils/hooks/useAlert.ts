import { Alert } from "react-native";

const useAlert = () => {
  // 단순 확인용 Alert
  const showAlert = (message: string, onConfirm?: () => void) => {
    Alert.alert(
      "",
      message,
      [
        {
          text: "확인",
          onPress: onConfirm || (() => {}), // onConfirm이 없으면 아무 동작도 하지 않음
        },
      ],
      { cancelable: true } // Alert 외부 클릭 시 닫힐 수 있도록 설정
    );
  };

  // 액션(확인/취소)용 Alert
  const showActionAlert = (
    message: string,
    actionText: string,
    onAction: () => void
  ) => {
    Alert.alert(
      "",
      message,
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: actionText,
          style: "destructive",
          onPress: onAction,
        },
      ],
      { cancelable: false }
    );
  };

  return { showAlert, showActionAlert };
};
export default useAlert;
