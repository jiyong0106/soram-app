import React, { memo } from "react";
// ✨ 1. ImageBackground 대신 View를 import 하고, LinearGradient를 새로 import 합니다.
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "@/components/common/AppText";
import { TopicListType } from "@/utils/types/topic";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useTicketGuard from "@/utils/hooks/useTicketGuard";
import ScalePressable from "../common/ScalePressable";
import useAlert from "@/utils/hooks/useAlert";

type Props = {
  item: TopicListType;
};

const TopicCard = ({ item }: Props) => {
  const router = useRouter();
  const { title, subQuestions, id, userCount } = item;
  const { showAlert, showActionAlert } = useAlert();

  const ensureNewResponse = useTicketGuard("VIEW_RESPONSE", {
    onInsufficient: () => showAlert("일일 티켓을 모두 소모했어요!"),
    optimistic: false, // 서버 성공 확인 후 차감
  });

  const handlePress = () => {
    showActionAlert(
      "다른 사람들의 이야기를 보시겠어요? \n (이야기 보기권 1장 사용)",
      "확인",
      () => {
        // 비관적: 페이지 진입 시점에서 차감하도록 보장 (useTicketGuard 내부 optimistic=false)
        ensureNewResponse.ensure(() => {
          router.push({
            pathname: "/topic/[topicId]",
            params: { topicId: id, title },
          });
        });
      }
    );
  };

  return (
    <ScalePressable onPress={handlePress} style={styles.container}>
      {/* ✨ 2. ImageBackground를 LinearGradient로 교체합니다. */}
      <LinearGradient
        colors={["#FFF3EC", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <AppText style={styles.cardTitle}>{title}</AppText>
        <View>
          {subQuestions.map((content, index) => (
            <AppText key={`${id}-${index}`} style={styles.cardSub}>
              {content}
            </AppText>
          ))}
        </View>

        <View style={styles.touch}>
          {/* ✨ 3. 텍스트를 디자인 시안에 맞게 변경합니다. */}
          <AppText style={styles.ctaText}>눌러서 이야기 보기</AppText>
          {/* ✨ 4. 아이콘 색상을 어두운 계열로 변경합니다. */}
          <MaterialIcons name="touch-app" size={24} color="#877974" />
        </View>
        <AppText style={styles.participants}>
          💬 {userCount}명이 이야기하고 있어요
        </AppText>
      </LinearGradient>
    </ScalePressable>
  );
};

export default memo(TopicCard);

// ✨ 5. 전체적인 스타일을 새로운 디자인에 맞게 대폭 수정합니다.
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10, // 양옆 여백을 조금 더 확보
    // 그림자가 잘리지 않도록 container 스타일에 그림자를 적용합니다.
    shadowColor: "#D2B4AA",
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5, // Android용 그림자
    marginBottom: 10,
  },
  gradientCard: {
    borderRadius: 24,
    paddingVertical: 50, // 상하 여백
    paddingHorizontal: 20, // 좌우 여백
    alignItems: "center", // 콘텐츠 중앙 정렬
    gap: 24, // 각 콘텐츠 그룹 사이의 간격
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 36,
    color: "#5C4B44", // 어두운 색으로 변경
    fontWeight: "bold",
    textAlign: "center",
  },
  cardSub: {
    marginTop: 8, // 질문 간 간격 조정
    fontSize: 14, // 보조 질문 폰트 크기 조정
    color: "#5C4B44", // 어두운 색으로 변경
    lineHeight: 26,
    textAlign: "left",
  },
  participants: {
    fontSize: 14,
    color: "#B0A6A0", // 어두운 색으로 변경
    fontWeight: "bold",
  },
  touch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 텍스트와 아이콘 사이 간격
  },
  // ctaText 스타일을 새로 추가합니다.
  ctaText: {
    fontSize: 16,
    color: "#5C4B44",
    fontWeight: "600",
  },
});
