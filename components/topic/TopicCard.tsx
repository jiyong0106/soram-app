import React, { memo, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
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
import useTicketGuard from "@/utils/hooks/useTicketGuard";
import ScalePressable from "../common/ScalePressable";
import useAlert from "@/utils/hooks/useAlert";

type Props = {
  item: TopicListType;
  loading?: boolean;
};

const TopicCard = ({ item, loading }: Props) => {
  const router = useRouter();
  // ✨ 2. '화면에 표시될 데이터'를 위한 내부 상태를 만듭니다. 초기값은 props로 받은 item입니다.
  const [displayItem, setDisplayItem] = useState(item);
  const { title, subQuestions, id, userCount } = displayItem; // 이제 모든 렌더링은 displayItem을 기준으로 합니다.

  const { showAlert, showActionAlert } = useAlert();

  const opacity = useSharedValue(1);
  const scaleAnimation = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      opacity.value = withTiming(0, { duration: 200 }); // 사라지는 애니메이션
      cancelAnimation(scaleAnimation);
      scaleAnimation.value = withTiming(0);
    } else {
      // ✨ 3. 로딩이 끝나면, 그 때 새로운 데이터로 '표시용 데이터'를 업데이트합니다.
      setDisplayItem(item);
      opacity.value = withTiming(1, { duration: 200 }); // 나타나는 애니메이션
      scaleAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 400 }),
          withTiming(0, { duration: 1000 })
        ),
        -1
      );
    }
  }, [loading, item]); // item도 dependency 배열에 추가해줘야 합니다.

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

  const ensureNewResponse = useTicketGuard("VIEW_RESPONSE", {
    onInsufficient: () => showAlert("일일 티켓을 모두 소모했어요!"),
    optimistic: false,
  });

  const handlePress = () => {
    if (loading) return;
    showActionAlert(
      "이 주제에 담긴 이야기들을 만나볼까요?\n\n이야기 보기권 1장을 사용합니다.",
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
      style={[styles.container, animatedScaleStyle]}
    >
      <LinearGradient
        colors={["#FFF3EC", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <Animated.View style={[styles.spinnerContainer, animatedSpinnerStyle]}>
          <ActivityIndicator size="large" color="#FF6B3E" />
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
