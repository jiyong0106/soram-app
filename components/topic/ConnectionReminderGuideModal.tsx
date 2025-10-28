import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

interface ConnectionReminderGuideModalProps {
  isVisible: boolean;
  onClose: () => void;
  peerUserName: string;
}

// 가이드 페이지 타입 (단순화)
type GuidePage = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
};

const ConnectionReminderGuideModal = ({
  isVisible,
  onClose,
  peerUserName,
}: ConnectionReminderGuideModalProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 이 모달에 맞는 텍스트로 수정
  const guidePages: GuidePage[] = [
    {
      icon: "checkmark-circle",
      title: "이야기를 작성하셨나요?",
      subtitle: `그렇다면 ${peerUserName}님과\n대화할 준비가 되었어요.`,
    },
    {
      icon: "hand-left",
      title: "창을 닫고, 대화 요청하기",
      subtitle: "버튼을 눌러보세요!",
    },
  ];

  const handleNext = () => {
    if (currentPage < guidePages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0); // 다음을 위해 0페이지로 리셋
      onClose(); // 모달 닫기
    }
  };

  const currentPageData = guidePages[currentPage];
  const isLastPage = currentPage === guidePages.length - 1;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleNext} // 안드로이드 뒤로가기 버튼
    >
      {/* 1. [모달 백드롭] (반투명 검은색 배경) */}
      <View style={styles.modalBackdrop}>
        {/* 2. [모달 컨테이너] (흰색 박스) */}
        <View style={styles.modalContainer}>
          {/* 3. 모달 아이콘 */}
          <Ionicons
            name={currentPageData.icon}
            size={48}
            color="#FF6B3E"
            style={styles.iconOnlyMargin}
          />

          {/* 4. 텍스트 */}
          <AppText style={styles.titleText}>{currentPageData.title}</AppText>
          {currentPageData.subtitle && (
            <AppText style={styles.subtitleText}>
              {currentPageData.subtitle}
            </AppText>
          )}

          {/* 5. 인디케이터 (점) */}
          <View style={styles.indicatorContainer}>
            {guidePages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === currentPage && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>

          {/* 6. 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <AppText style={styles.buttonText}>
              {isLastPage ? "확인" : "다음"}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 스타일은 ReceiverRequestGuideModal과 거의 동일 (스포트라이트 관련 제외)
const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  iconOnlyMargin: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C4B44",
    lineHeight: 28,
  },
  subtitleText: {
    fontSize: 16,
    color: "#5C4B44",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginBottom: 24,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    backgroundColor: "#FF6B3E",
  },
  button: {
    width: "100%",
    backgroundColor: "#FF6B3E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConnectionReminderGuideModal;
