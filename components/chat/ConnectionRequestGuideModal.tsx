import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
// 모달에 필요한 props 정의
interface ConnectionRequestGuideModalProps {
  isVisible: boolean;
  onClose: () => void;
  peerUserName: string;
  topicTitle: string;
}

// 각 가이드 페이지의 내용을 담는 타입
type GuidePage = {
  icon?: keyof typeof Ionicons.glyphMap;
  entypoIcon?: keyof typeof Entypo.glyphMap;
  title: string;
  subtitle?: string;
  highlight?: string;
  example?: string;
};

const ConnectionRequestGuideModal = ({
  isVisible,
  onClose,
  peerUserName,
  topicTitle,
}: ConnectionRequestGuideModalProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 기획한 5단계 가이드 내용
  const guidePages: GuidePage[] = [
    {
      icon: "paper-plane-outline",
      title: `${peerUserName}님에게`,
      subtitle: "대화 요청을 보냈어요!",
    },
    {
      icon: "chatbubble-ellipses-outline",
      title: `어떤 말로 시작할지 고민되시나요?`,
      subtitle: "두 분은 이미 공감대가 있답니다.😊",
    },
    {
      entypoIcon: "link",
      title: "두 분을 이어준 주제인",
      highlight: `"${topicTitle}"`,
      example:
        '이 주제로 대화를 시작해보세요!\n\n"안녕하세요! 저와 생각이 비슷하시네요."\n"너무 공감되는 이야기라서 눈길이 갔어요!"',
    },
    {
      icon: "flame",
      title: "용기 있는 첫걸음을 응원해요!",
      subtitle: "좋은 인연으로 이어지길 바랄게요.",
    },
  ];

  const handleNext = () => {
    if (currentPage < guidePages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // 마지막 페이지에서 버튼을 누르면 모달을 닫습니다.
      onClose();
    }
  };

  // 현재 페이지 데이터
  const currentPageData = guidePages[currentPage];
  const isLastPage = currentPage === guidePages.length - 1;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* ▼▼▼ [수정] 조건부로 아이콘을 렌더링하도록 변경 ▼▼▼ */}
          {currentPageData.entypoIcon ? (
            <Entypo
              name={currentPageData.entypoIcon}
              size={48}
              color="#FF6B3E"
              style={styles.icon}
            />
          ) : currentPageData.icon ? (
            <Ionicons
              name={currentPageData.icon}
              size={48}
              color="#FF6B3E"
              style={styles.icon}
            />
          ) : null}
          {/* ▲▲▲ 수정 완료 ▲▲▲ */}

          {/* 메인 텍스트 */}
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

          {/* 예시 텍스트 (있을 경우) */}
          {currentPageData.example && (
            <AppText style={styles.exampleText}>
              {currentPageData.example}
            </AppText>
          )}

          {/* 페이지 인디케이터 (점) */}
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

          {/* 하단 버튼 */}
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    lineHeight: 28,
  },
  subtitleText: {
    fontSize: 14,
    color: "#5C4B44",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  highlightText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B3E",
    textAlign: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FFF5F0",
    borderRadius: 8,
    overflow: "hidden", // borderRadius를 적용하기 위해
  },
  exampleText: {
    fontSize: 14,
    color: "#5C4B44",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
    fontStyle: "italic",
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

export default ConnectionRequestGuideModal;
