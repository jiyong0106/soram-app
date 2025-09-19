import { useTicketsStore } from "@/utils/store/useTicketsStore";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import TicketsSheet from "./TicketsSheet";
import { useEffect, useRef, useState } from "react";
import ScalePressable from "../common/ScalePressable";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
// 🚨 1. BottomSheetModal의 타입을 import 합니다.
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

const TicketsView = () => {
  const storeState = useTicketsStore();
  const { data, initialized } = storeState;

  // 🚨 2. useRef에 BottomSheetModal 타입을 명시해줍니다.
  const actionSheetRef = useRef<BottomSheetModal>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (containerWidth === 0) return;
    const gradientWidth = containerWidth * 3;
    const animationRange = gradientWidth - containerWidth;
    translateX.value = withRepeat(
      withTiming(-animationRange, {
        duration: 500,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [containerWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (!initialized) {
    return null;
  }

  const { CHAT, VIEW_RESPONSE } = data;

  const items = [
    {
      icon: (
        <Ionicons name="chatbubble-ellipses-sharp" size={22} color="#FF8A5B" />
      ),
      value: CHAT.totalQuantity,
    },
    {
      icon: <Ionicons name="book" size={22} color="#6A839A" />,
      value: VIEW_RESPONSE.totalQuantity,
    },
  ];

  return (
    // ✅ 이제 이 부분에서 오류가 발생하지 않습니다.
    <ScalePressable onPress={() => actionSheetRef.current?.present?.()}>
      <View
        style={styles.gradientBorderContainer}
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      >
        {containerWidth > 0 && (
          <Animated.View
            style={[
              { width: containerWidth * 3 },
              styles.gradientAnimator,
              animatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#E86A78", "#A89CF7", "#72D6EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
          </Animated.View>
        )}

        <View style={styles.innerContainer}>
          <AppText style={styles.headerText}>보유중인 이용권</AppText>
          <View style={styles.ticketWrap}>
            {items.map(({ icon, value }, id) => (
              <View key={id} style={styles.ticket}>
                {icon}
                <AppText style={styles.ticketText}>{value}</AppText>
              </View>
            ))}
          </View>
        </View>
      </View>
      <TicketsSheet ref={actionSheetRef} snapPoints={["50%"]} />
    </ScalePressable>
  );
};

export default TicketsView;

const styles = StyleSheet.create({
  gradientBorderContainer: {
    borderRadius: 30,
    overflow: "hidden",
    // width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  gradientAnimator: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: "#fff",
    margin: 1.25,
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5C4B44",
  },
  ticketWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  ticket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
});
