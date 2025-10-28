import React, { memo, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import AppText from "@/components/common/AppText";
import { TopicListType } from "@/utils/types/topic";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PulsatingSpinner from "../common/PulsatingSpinner";
import { useTicketsStore } from "@/utils/store/useTicketsStore";
import ScalePressable from "../common/ScalePressable";
import useAlert from "@/utils/hooks/useAlert";

type Props = {
  item: TopicListType;
  loading?: boolean;
  isActive?: boolean;
};

const TopicCard = ({ item, loading, isActive = true }: Props) => {
  const router = useRouter();
  //  2. '화면에 표시될 데이터'를 위한 내부 상태를 만듭니다. 초기값은 props로 받은 item입니다.
  const [displayItem, setDisplayItem] = useState(item);
  const { title, subQuestions, id, userCount } = displayItem; // 이제 모든 렌더링은 displayItem을 기준으로 합니다.

  const { showAlert, showActionAlert } = useAlert();

  const opacity = useSharedValue(1);
  const scaleAnimation = useSharedValue(0);

  useEffect(() => {
    // 로딩 중일 때는 항상 사라지는 애니메이션과 함께 애니메이션 초기화
    if (loading) {
      opacity.value = withTiming(0, { duration: 100 });
      cancelAnimation(scaleAnimation);
      scaleAnimation.value = withTiming(0);
      return;
    }

    // 로딩이 끝났을 때, 새로운 데이터로 '표시용 데이터'를 업데이트
    setDisplayItem(item);
    opacity.value = withTiming(1, { duration: 200 });

    // 활성화 상태일 때만 반복 애니메이션 실행
    if (isActive) {
      scaleAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 400 }),
          withTiming(0, { duration: 1000 })
        ),
        -1
      );
    } else {
      // 비활성화 상태이면 애니메이션을 멈추고 초기 상태로
      cancelAnimation(scaleAnimation);
      scaleAnimation.value = withTiming(0);
    }

    // 컴포넌트가 언마운트될 때 애니메이션 정리
    return () => {
      cancelAnimation(scaleAnimation);
    };
  }, [loading, item, isActive]); // isActive를 의존성 배열에 추가

  const animatedBodyStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    // 스피너는 로딩 중일 때만 보이도록 명확하게 제어합니다.
    opacity: loading ? 1 : 0,
  }));

  const animatedScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(scaleAnimation.value, [0, 1], [1, 1.03]);
    return {
      transform: [{ scale }],
    };
  });

  const ticketsHas = useTicketsStore((s) => s.has);

  const handlePress = () => {
    if (loading) return;

    // userCount가 0인지 아닌지에 따라 로직을 분기합니다.
    if (userCount === 0) {
      // 이야기가 없는 경우: 이야기 작성을 유도합니다.
      showActionAlert(
        "첫 이야기를 남겨주세요.\n\n내 이야기에 공감한 누군가가\n\n대화를 요청할지도 몰라요!",
        "작성하기", // 버튼 텍스트를 더 명확하게 변경
        () => {
          // 이야기 '작성' 페이지로 이동시킵니다.
          router.push({
            pathname: "/topic/list/[listId]",
            params: { listId: id },
          });
        }
      );
    } else {
      // 이야기가 있는 경우: 기존 로직을 그대로 실행합니다.
      showActionAlert(
        "이 주제에 담긴 이야기들을 만나볼까요?\n\n이야기 보기권 1장을 사용합니다.\n\n한 번 확인한 이야기는 언제든\n\n'활동'에서 다시 볼 수 있어요.",
        "확인",
        () => {
          // 한글 주석: 낙관적 차감 금지. 보유 여부만 게이트하고, 실제 차감은 대상 페이지 성공 시 처리됨
          const has = ticketsHas("VIEW_RESPONSE");
          if (!has) {
            showAlert("일일 티켓을 모두 소모했어요!");
            return;
          }
          router.push({
            pathname: "/topic/[topicId]",
            params: { topicId: id, title },
          });
        }
      );
    }
  };

  return (
    <ScalePressable
      onPress={handlePress}
      style={[styles.container, animatedScaleStyle]}
    >
      <LinearGradient
        colors={["#FFF3EC", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <Animated.View style={[styles.spinnerContainer, animatedSpinnerStyle]}>
          <PulsatingSpinner />
        </Animated.View>

        <Animated.View style={[styles.bodyContainer, animatedBodyStyle]}>
          <AppText style={styles.cardTitle}>{title}</AppText>
          <View>
            {subQuestions.map((content, index) => (
              <AppText key={`${id}-${index}`} style={styles.cardSub}>
                {content}
              </AppText>
            ))}
          </View>
          <View style={styles.touch}>
            <AppText style={styles.ctaText}>눌러서 이야기 보기</AppText>
            <MaterialIcons name="touch-app" size={20} color="#5C4B44" />
          </View>
          <AppText style={styles.participants}>
            {userCount === 0
              ? "👋 이 주제의 첫 이야기가 되어주세요!"
              : `💬 ${userCount}명이 이야기하고 있어요`}
          </AppText>
        </Animated.View>
      </LinearGradient>
    </ScalePressable>
  );
};

export default memo(TopicCard);

// Styles는 이전과 동일하므로 생략합니다.
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    shadowColor: "#D2B4AA",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  gradientCard: {
    borderRadius: 24,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    minHeight: 300,
    justifyContent: "center",
  },
  spinnerContainer: {
    position: "absolute",
  },
  bodyContainer: {
    alignItems: "center",
    gap: 24,
    width: "100%",
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 36,
    color: "#5C4B44",
    fontWeight: "bold",
    textAlign: "center",
  },
  cardSub: {
    marginTop: 8,
    fontSize: 14,
    color: "#5C4B44",
    lineHeight: 26,
    textAlign: "left",
  },
  participants: {
    fontSize: 14,
    color: "#B0A6A0",
    fontWeight: "bold",
  },
  touch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    color: "#5C4B44",
    fontWeight: "600",
  },
});
