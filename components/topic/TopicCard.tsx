import React, { memo, useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
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
// [수정] 새로 추가한 이미지 매퍼 유틸리티를 임포트합니다.
import { getTopicImageByCategory } from "@/utils/util/topicImageMapper";

type Props = {
  item: TopicListType;
  loading?: boolean;
  isActive?: boolean;
};
// [제거] 하드코딩되었던 이미지 변수를 제거합니다.
// const TopicImage = require("@/assets/topicImages/travel.png");

// Image 컴포넌트를 Animated 컴포넌트로 만듭니다.
// 이렇게 하면 텍스트와 이미지가 동일한 opacity 애니메이션을 공유할 수 있습니다.
const AnimatedImage = Animated.createAnimatedComponent(Image);

const TopicCard = ({ item, loading, isActive = true }: Props) => {
  const router = useRouter(); // 2. '화면에 표시될 데이터'를 위한 내부 상태를 만듭니다. 초기값은 props로 받은 item입니다.
  const [displayItem, setDisplayItem] = useState(item); // [수정] displayItem에서 category를 구조 분해 할당합니다.
  const { title, subQuestions, id, userCount, category } = displayItem; // 이제 모든 렌더링은 displayItem을 기준으로 합니다.

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
    } // 로딩이 끝났을 때, 새로운 데이터로 '표시용 데이터'를 업데이트

    setDisplayItem(item);
    opacity.value = withTiming(1, { duration: 200 }); // 활성화 상태일 때만 반복 애니메이션 실행

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
    } // 컴포넌트가 언마운트될 때 애니메이션 정리

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
    if (loading) return; // userCount가 0인지 아닌지에 따라 로직을 분기합니다.
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
  }; // category 값을 기반으로 유틸리티 함수를 호출하여 동적 이미지 소스를 가져옵니다.

  const topicImageSource = getTopicImageByCategory(category);

  return (
    <ScalePressable
      onPress={handlePress}
      style={[styles.container, animatedScaleStyle]}
    >
      <View style={styles.topicCard}>
        <Animated.View style={[styles.spinnerContainer, animatedSpinnerStyle]}>
          <PulsatingSpinner />
        </Animated.View>
        <AnimatedImage
          source={topicImageSource} // 동적 소스 적용
          style={[styles.cardImage, animatedBodyStyle]} // opacity 애니메이션 적용
        />

        <Animated.View style={[styles.bodyContainer, animatedBodyStyle]}>
          <AppText style={styles.cardTitle}>{title}</AppText>
          <View style={styles.touch}>
            <MaterialIcons name="touch-app" size={16} color="#5C4B44" />
            <AppText style={styles.ctaText}>눌러서 이야기 보기</AppText>
          </View>

          <AppText style={styles.participants}>
            {userCount === 0
              ? "👋 이 주제의 첫 이야기가 되어주세요!"
              : `💬 ${userCount}명이 이야기하고 있어요`}
          </AppText>
        </Animated.View>
      </View>
    </ScalePressable>
  );
};

export default memo(TopicCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    shadowColor: "#595F69",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },
  topicCard: {
    backgroundColor: "#fff",
    borderRadius: 24, // borderWidth: 0.25, // borderColor: "#B0A6A0",
    paddingTop: 0,
    paddingBottom: 20, // paddingHorizontal: 20,
    alignItems: "center",
    height: 450,
    justifyContent: "space-between", // 이미지를 카드 모서리에 맞게 자르기 위해 overflow: "hidden" 추가
    overflow: "hidden", // 그림자를 잘라내던 주범이지만, 여기서는(안쪽 View) 이미지 클리핑을 위해 필요합니다.
  },
  spinnerContainer: {
    position: "absolute",
    // 4방향을 모두 0으로 설정하여 부모(topicCard)를 꽉 채웁니다.
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // flex를 이용해 자식(PulsatingSpinner)을 중앙 정렬합니다.
    justifyContent: "center",
    alignItems: "center",
    // zIndex를 1로 주어 이미지나 텍스트 위에 확실히 올라오도록 보장합니다.
    zIndex: 1,
  },
  bodyContainer: {
    alignItems: "flex-start",
    gap: 4,
    width: "100%",
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 36,
    color: "#000000",
    fontWeight: "bold",
    paddingLeft: 12,
  },
  participants: {
    fontSize: 12,
    color: "#B0A6A0",
    fontWeight: "bold",
    paddingLeft: 12,
  },
  touch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingBottom: 8,
    paddingLeft: 12,
  },
  ctaText: {
    fontSize: 14,
    color: "#5C4B44",
    fontWeight: "600",
    alignItems: "center",
  },
  cardImage: {
    width: "100%", // 카드 너비에 맞춤
    height: 330, // 적절한 높이 설정 (조절 가능)
    borderTopLeftRadius: 24, // card borderRadius와 일치
    borderTopRightRadius: 24, // card borderRadius와 일치
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    resizeMode: "cover", // 이미지가 잘리지 않고 채워지도록 설정 // marginBottom: 10, // 이미지와 하단 텍스트 사이 간격 // 이미지를 카드 상단에 배치하기 위해 position을 absolute로 변경할 수 있으나, // 지금은 flex-end와 함께 이미지도 위쪽으로 밀려 올라가므로, // 이미지 예시처럼 카드의 상단에 가깝게 배치하고 싶다면 // topicCard의 justifyContent를 "space-between" 등으로 변경하거나, // 이미지를 absolute로 띄우고 bodyContainer에 적절한 top margin을 줘야 합니다. // 일단은 현재 flex-end 정렬을 유지하면서 이미지와 텍스트를 함께 올립니다.
  },
});
