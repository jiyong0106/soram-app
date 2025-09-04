import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import AppText from "@/components/common/AppText";
import { Entypo } from "@expo/vector-icons";

type Props = {
  subQuestions: string[];
};

export default function VerticalQuestionSlider({ subQuestions }: Props) {
  const listRef = useRef<FlatList<string>>(null);
  const [containerH, setContainerH] = useState(0);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    // 현재 페이지 인덱스 계산 (세로)
    const i = Math.round(contentOffset.y / layoutMeasurement.height);

    // 끝에서 한 칸 더 내리면 처음으로 점프
    if (i >= subQuestions.length) {
      // 프레임 뒤에 점프하면 깜빡임 적음
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 0, animated: false });
      });
      return;
    }
  };

  // 각 아이템 높이를 컨테이너 높이와 동일하게 맞춰 페이지 스냅
  const renderItem: ListRenderItem<string> = ({ item, index }) => {
    const realIndex = index % subQuestions.length;
    const text = subQuestions[realIndex];

    return (
      <View style={[styles.slide, { height: containerH }]}>
        <AppText style={styles.text}>{`${realIndex + 1}. ${text}`}</AppText>
      </View>
    );
  };

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => setContainerH(e.nativeEvent.layout.height)}
    >
      <FlatList
        ref={listRef}
        data={subQuestions.concat([""])}
        // 마지막에 dummy 한 장 추가 → 마지막에서 한 번 더 스와이프 시 onMomentumEnd에서 0번으로 점프
        keyExtractor={(s, i) => `${s}-${i}`}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, idx) => ({
          length: containerH,
          offset: containerH * idx,
          index: idx,
        })}
        // 세로 슬라이드
        horizontal={false}
      />
      <Entypo name="select-arrows" size={18} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 40, // 질문 영역 높이(필요 시 조절/혹은 부모에서 높이 주기)
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  slide: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ff6b6b",
  },
});
