import React, { ForwardedRef, forwardRef, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppBottomSheetModal from "@/components/common/AppBottomSheetModal";
import AppText from "../common/AppText";
import { useTicketsStore } from "@/utils/store/useTicketsStore";
import type { TicketBreakdownItem, TicketSourceType } from "@/utils/types/auth";
import dayjs from "dayjs";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const AnimatedAppText = Animated.createAnimatedComponent(AppText);

const Row = ({
  icon, // 변경점 3: code, color 대신 icon prop을 받습니다.
  title,
  // desc,
  totalQuantity,
  breakdown,
}: {
  icon: React.ReactNode; // React 컴포넌트를 받을 수 있도록 타입을 지정합니다.
  title: string;
  desc: string;
  totalQuantity: number;
  breakdown: TicketBreakdownItem[];
}) => {
  const processedBreakdown = useMemo(() => {
    const dailyTicket = breakdown.find((item) => item.sourceType === "DAILY");
    const storedTickets = breakdown.filter(
      (item) => item.sourceType !== "DAILY"
    );
    const getExpiresText = (expiresAt: string) => {
      const diff = dayjs(expiresAt).diff(dayjs(), "day");
      if (diff < 0) return "(기간 만료)";
      if (diff === 0) return "오늘이 사용할 수 있는 마지막 날이에요!";
      return `${diff + 1}일 뒤에 사라져요`;
    };
    const getSourceTypeText = (sourceType: TicketSourceType) => {
      if (sourceType === "EVENT") return "이벤트 이용권";
      if (sourceType === "PAID") return "구매한 이용권";
      return "보관중인 이용권";
    };

    return {
      daily: dailyTicket
        ? {
            quantity: dailyTicket.quantity,
          }
        : null,
      stored: storedTickets.map((item) => ({
        quantity: item.quantity,
        text: `${getSourceTypeText(item.sourceType)}`,
        expiresText: getExpiresText(item.expiresAt),
      })),
    };
  }, [breakdown]);

  const dailyRatio = useMemo(() => {
    if (!processedBreakdown.daily || totalQuantity === 0) {
      return 0;
    }
    return (processedBreakdown.daily.quantity / totalQuantity) * 100;
  }, [processedBreakdown.daily, totalQuantity]);

  const opacity = useSharedValue(1);

  useEffect(() => {
    if (processedBreakdown.daily) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.25, { duration: 750 }),
          withTiming(1, { duration: 750 })
        ),
        -1,
        true
      );
    }
  }, [processedBreakdown.daily, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.row}>
      {/* --- 상단 UI 부분 --- */}
      <View style={styles.rowTop}>
        <View style={styles.rowLeft}>
          {icon}
          <AppText style={styles.rowTitle}>{title}</AppText>
        </View>
        <AppText style={styles.totalQuantityText}>총 {totalQuantity}개</AppText>
      </View>
      {/* <AppText style={styles.rowDesc}>{desc}</AppText> */}
      {/* --- 하단 상세 내역 부분 --- */}
      <View style={styles.breakdownList}>
        {processedBreakdown.daily && (
          <View style={styles.breakdownItem}>
            {/* 변경점 1: 텍스트와 변수를 하나의 문자열로 합쳐줍니다. */}
            <AnimatedAppText
              style={[styles.breakdownText, styles.dailyText, animatedStyle]}
            >
              {`‣ 오늘 무료로 받은 이용권 ${processedBreakdown.daily.quantity}개`}
            </AnimatedAppText>
          </View>
        )}
        {processedBreakdown.stored.map((item, index) => (
          <View key={index} style={styles.breakdownItem}>
            <AppText style={styles.breakdownText}>
              {`‣ ${item.text} ${item.quantity}개`}
            </AppText>
            <AppText style={styles.expiresText}>{item.expiresText}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

//현재 문제점
//만약 다른 사람의 이야기를 본 경우,
//totalQuantity는 최신화가 잘 됨
//오늘 무료로 받은 이용권은 최신화가 잘 됨

//하지만 breakdown은 최신화가 안 됨
//processedBreakdown.stored는 최신화가 안 됨

// --- 변경점: 누락된 props와 ref를 다시 받도록 함수 시그니처 수정 ---
const TicketsSheet = (
  { snapPoints }: { snapPoints?: ReadonlyArray<string | number> },
  ref: ForwardedRef<BottomSheetModal>
) => {
  // 변경점 1: TicketsView와 동일하게, initialized 상태를 함께 가져옵니다.
  const data = useTicketsStore((s) => s.data);
  const initialized = useTicketsStore((s) => s.initialized);
  // 변경점 2: 데이터가 준비되지 않았다면 렌더링하지 않도록 안전장치를 추가합니다.
  if (!initialized) {
    return null;
  }

  // 이 시점부터 data는 안전하게 사용할 수 있습니다.
  const { CHAT, VIEW_RESPONSE } = data;

  return (
    <AppBottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: "#FFFFFF" }}
    >
      <View style={styles.container}>
        {/* 변경점 2: LinearGradient 컴포넌트를 배경으로 추가 */}
        <AppText style={styles.header}>보유중인 이용권</AppText>
        <Row
          icon={
            <Ionicons
              name="chatbubble-ellipses-sharp"
              size={22}
              color="#FF8A5B"
            />
          }
          title="대화 요청권"
          desc="마음에 드는 상대방에게 대화를 요청할 수 있어요"
          totalQuantity={CHAT.totalQuantity}
          breakdown={CHAT.breakdown}
        />
        <View style={styles.divider} />
        {/* '이야기 보기권'에도 어울리는 아이콘을 추가했습니다. */}
        <Row
          icon={<Ionicons name="book" size={22} color="#6A839A" />}
          title="이야기 보기권"
          desc="다양한 주제에 남겨진 이야기들을 볼 수 있어요"
          totalQuantity={VIEW_RESPONSE.totalQuantity}
          breakdown={VIEW_RESPONSE.breakdown}
        />
      </View>
    </AppBottomSheetModal>
  );
};

export default forwardRef(TicketsSheet);

const styles = StyleSheet.create({
  container: {
    flex: 1, // 자식 요소들을 감싸기 위해 추가
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5C4B44",
    textAlign: "center",
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 10,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowTitle: {
    fontSize: 16,
    color: "#5C4B44",
  },
  totalQuantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C4B44",
  },
  rowDesc: {
    fontSize: 14,
    color: "#B0A6A0",
    textAlign: "left",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#5C4B44",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  // stackedBarContainer: {
  //   height: 24,
  //   borderRadius: 2,
  //   backgroundColor: "#5C4B44", // 기본 배경색
  //   marginVertical: 10,
  //   marginHorizontal: 5,
  //   overflow: "hidden", // 자식 요소가 부모 밖으로 나가지 않도록 설정
  // },
  // stackedBarFilled: {
  //   height: "100%",
  //   backgroundColor: "#B0A6A0", // 오늘 소멸 재화 색상
  //   borderRadius: 2,
  // },
  breakdownList: {
    marginLeft: 5,
    gap: 12,
    marginVertical: 2,
  },
  breakdownItem: {
    gap: 4,
  },
  breakdownText: {
    fontSize: 14,
    color: "#5C4B44",
    marginVertical: 2,
  },
  dailyText: {
    // fontWeight: "bold",
    color: "#5C4B44",
  },
  expiresText: {
    fontSize: 12,
    color: "#B0A6A0",
    marginLeft: 12,
    marginTop: 4,
  },
});
