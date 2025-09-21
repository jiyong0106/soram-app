import React, { memo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  // ✨ 1. withSequence를 추가로 import 합니다.
  withSequence,
} from "react-native-reanimated";
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

  // --- ✨ 2. 애니메이션 로직을 Scale(크기) 방식으로 변경합니다. ✨ ---
  const animation = useSharedValue(0);

  useEffect(() => {
    // withSequence를 사용해 '쿵... (잠시 쉼)' 하는 심장박동 효과를 만듭니다.
    animation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200 }), // 빠르게 커졌다가
        withTiming(0, { duration: 400 }), // 천천히 돌아오고
        withTiming(0, { duration: 1000 }) // 잠시 멈춥니다.
      ),
      -1 // 무한 반복
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // animation.value가 0->1->0으로 변할 때, scale 값은 1->1.03->1로 변합니다.
    const scale = interpolate(animation.value, [0, 1], [1, 1.03]); // 3% 커지는 효과

    return {
      // 이제 shadowOpacity 대신 transform의 scale 값을 변경합니다.
      transform: [{ scale }],
    };
  });

  // --- ✨ 애니메이션 로직 변경 끝 ✨ ---

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
    <ScalePressable
      onPress={handlePress}
      style={[styles.container, animatedStyle]}
    >
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
          <MaterialIcons name="touch-app" size={24} color="#5C4B44" />
        </View>
        <AppText style={styles.participants}>
          {userCount === 0
            ? "👋 이 주제의 첫 이야기가 되어주세요!"
            : `💬 ${userCount}명이 이야기하고 있어요`}
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
    // ✨ 3. 그림자 투명도는 이제 고정값으로 돌아갑니다.
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
    fontSize: 24,
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
