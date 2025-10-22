import React, { useState } from "react"; // 1. useState 임포트
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

interface ReceiverRequestGuideModalProps {
  isVisible: boolean;
  onClose: () => void;
  peerUserName: string;
}

// --- 2. 가이드 페이지 내용 정의 ---
type GuidePage = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  highlight?: string;
};

const ReceiverRequestGuideModal = ({
  isVisible,
  onClose,
  peerUserName,
}: ReceiverRequestGuideModalProps) => {
  // 3. 현재 페이지 state 추가
  const [currentPage, setCurrentPage] = useState(0); // 4. 수신자용 3단계 가이드 정의

  const guidePages: GuidePage[] = [
    {
      icon: "chatbubble-ellipses-outline",
      title: `${peerUserName}님이\n대화를 요청했어요`,
    },
    {
      icon: "arrow-up-circle-outline", // 코치 마크 대신 '위쪽'을 가리키는 아이콘
      title: `상단 배너를 눌러\n${peerUserName}님의\n이야기를 확인해 보세요!`,
    },
    {
      icon: "sparkles-outline",
      title: "좋은 인연으로 이어지길 바랄게요 ☺️",
      highlight: "같은 생각으로 연결된 우리, 소람",
    },
  ]; // 5. 다음 페이지로 이동 (마지막이면 닫기)

  const handleNext = () => {
    if (currentPage < guidePages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0); // 닫힌 후 다시 열릴 때를 대비해 0으로 리셋
      onClose();
    }
  }; // 6. 현재 페이지 데이터 및 마지막 페이지 여부

  const currentPageData = guidePages[currentPage];
  const isLastPage = currentPage === guidePages.length - 1;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleNext} // 뒤로가기 버튼으로도 닫히도록
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Ionicons
            name={currentPageData.icon} // 7. 현재 페이지 아이콘
            size={48}
            color="#FF6B3E"
            style={styles.icon}
          />

          <AppText style={styles.titleText}>{currentPageData.title}</AppText>
          {/* 부가 텍스트 (있을 경우) */}
          {currentPageData.subtitle && (
            <AppText style={styles.subtitleText}>
              {currentPageData.subtitle}
            </AppText>
          )}
          {/* 하이라이트 텍스트 (있을 경우) */}
          {currentPageData.highlight && (
            <AppText style={styles.highlightText}>
              {currentPageData.highlight}
            </AppText>
          )}
          {/* 8. 페이지 인디케이터 (점) */}
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
          {/* 9. 하단 버튼 */}
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
  icon: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C4B44",
    lineHeight: 28, // 텍스트가 여러 줄이 될 수 있으므로 최소 높이 보장
    minHeight: 56, // 28 * 2
  },
  subtitleText: {
    fontSize: 16,
    color: "#5C4B44",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B3E",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  }, // --- 10. 인디케이터 스타일 추가 ---
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
    alignItems: "center", // marginTop: 24, // 인디케이터가 있으므로 삭제
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReceiverRequestGuideModal;
