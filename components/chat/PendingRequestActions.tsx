import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../common/Button";
import AppText from "../common/AppText";

interface PendingRequestActionsProps {
  onAccept: () => void;
  onReject: () => void;
  loading: boolean;
}

const PendingRequestActions = ({
  onAccept,
  onReject,
  loading,
}: PendingRequestActionsProps) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.guideText}>
        지금은 메시지 읽음 여부를 상대가 알 수 없으니,
      </AppText>
      <AppText style={styles.guideText}>
        편안한 마음으로 결정해 보세요 😉
      </AppText>
      <View style={styles.buttonContainer}>
        {/* 1. 각 버튼을 flex: 1 속성을 가진 View로 감싸줍니다. */}
        <View style={styles.buttonWrapper}>
          <Button
            label="거절하기"
            onPress={onReject}
            disabled={loading}
            // 2. Button 자체에는 flex 속성 없이 배경색, 높이 등 순수 스타일만 전달합니다.
            style={[styles.buttonBase, styles.rejectButton]}
            textColor="#B0A6A0"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            label="수락하기"
            onPress={onAccept}
            disabled={loading}
            style={[styles.buttonBase, styles.acceptButton]}
            textColor="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 12,
  },
  guideText: {
    textAlign: "center",
    marginBottom: 12,
    color: "#5C4B44",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  // 버튼을 감싸서 flex 레이아웃을 담당할 wrapper 스타일
  buttonWrapper: {
    flex: 1,
  },
  // 기존 button 스타일에서 flex: 1 속성을 제거하고 buttonBase로 이름 변경
  buttonBase: {
    borderRadius: 12,
  },
  rejectButton: {
    backgroundColor: "#F7F5F4",
    borderColor: "#d9d9d9",
    borderWidth: 1,
  },
  acceptButton: {
    backgroundColor: "#FF6B3E",
    borderColor: "#FF6B3E",
    borderWidth: 1,
  },
});

export default PendingRequestActions;
