import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "react-native-screens";

interface BannerLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface ReceiverRequestGuideModalProps {
  isVisible: boolean;
  onClose: () => void;
  peerUserName: string;
  bannerLayout?: BannerLayout;
}
type GuidePage = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  highlight?: string;
};
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ReceiverRequestGuideModal = ({
  isVisible,
  onClose,
  peerUserName,
  bannerLayout,
}: ReceiverRequestGuideModalProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const guidePages: GuidePage[] = [
    {
      icon: "chatbubble-ellipses",
      title: `${peerUserName}님이`,
      subtitle: "대화를 요청했어요!",
    },
    {
      // 2페이지 아이콘
      icon: "arrow-up-outline",
      title: `상단 배너에서`,
      subtitle: "서로의 이야기를 확인할 수 있어요.",
    },
    {
      icon: "flame",
      title: "좋은 인연으로",
      subtitle: "이어지길 응원할게요!",
    },
  ];
  const handleNext = () => {
    if (currentPage < guidePages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0);
      onClose();
    }
  };
  const currentPageData = guidePages[currentPage];
  const isLastPage = currentPage === guidePages.length - 1;
  const isSpotlightPage = currentPage === 1 && bannerLayout;

  useEffect(() => {
    if (isSpotlightPage) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -8,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => {
        animation.stop();
        animatedValue.setValue(0);
      };
    }
  }, [isSpotlightPage, animatedValue]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleNext}
    >
      {/* [스포트라이트 배경] */}
      {isSpotlightPage && (
        <>
          <View
            style={[
              styles.overlay,
              { height: bannerLayout.y, width: screenWidth },
            ]}
          />
          <View
            style={[
              styles.overlay,
              {
                top: bannerLayout.y + bannerLayout.height,
                height: screenHeight - (bannerLayout.y + bannerLayout.height),
                width: screenWidth,
              },
            ]}
          />
          <View
            style={[
              styles.overlay,
              {
                top: bannerLayout.y,
                height: bannerLayout.height,
                width: bannerLayout.x,
              },
            ]}
          />
          <View
            style={[
              styles.overlay,
              {
                top: bannerLayout.y,
                height: bannerLayout.height,
                left: bannerLayout.x + bannerLayout.width,
                width: screenWidth - (bannerLayout.x + bannerLayout.width),
              },
            ]}
          />
        </>
      )}

      {/* [모달 백드롭] */}
      <View
        style={[
          styles.modalBackdrop,
          isSpotlightPage && styles.transparentBackdrop,
        ]}
      >
        {/* [애니메이션 화살표]*/}
        {isSpotlightPage && bannerLayout && (
          <Animated.View
            style={[
              styles.arrowContainer,
              {
                top: bannerLayout.y + bannerLayout.height + 10,
                transform: [{ translateY: animatedValue }],
              },
            ]}
          >
            <Ionicons
              name={currentPageData.icon}
              size={48}
              color="#FF7D4A" // 주황색 (활성)
            />
          </Animated.View>
        )}

        {/* 4. [모달 컨테이너] (흰색 박스) */}
        <View style={styles.modalContainer}>
          {/*
           * 5. 모달 아이콘
           * *회색(비활성)*, *정적(애니메이션 없음)*으로 표시
           * - 1, 3페이지: 기존 주황색 아이콘 렌더링
           */}
          {isSpotlightPage ? (
            <Ionicons // 2페이지 (회색, 정적)
              name={"search"}
              size={48}
              color="#FF6B3E" // 비활성화된 회색 (인디케이터 색상)
              style={styles.iconOnlyMargin} // (marginBottom: 20)
            />
          ) : (
            <Ionicons // 1, 3페이지 (주황색, 정적)
              name={currentPageData.icon}
              size={48}
              color="#FF6B3E"
              style={styles.iconOnlyMargin} // (marginBottom: 20)
            />
          )}

          <AppText style={styles.titleText}>{currentPageData.title}</AppText>
          {currentPageData.subtitle && (
            <AppText style={styles.subtitleText}>
              {currentPageData.subtitle}
            </AppText>
          )}
          {currentPageData.highlight && (
            <AppText style={styles.highlightText}>
              {currentPageData.highlight}
            </AppText>
          )}
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
  transparentBackdrop: {
    backgroundColor: "transparent",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    top: 0,
    left: 0,
  },
  arrowContainer: {
    position: "absolute",
    alignSelf: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },

  // 'iconSpacer'를 삭제하고 'iconOnlyMargin'을 재사용
  iconOnlyMargin: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C4B44",
    lineHeight: 28,
    // minHeight: 56,
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

export default ReceiverRequestGuideModal;
