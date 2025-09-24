import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import AppText from "@/components/common/AppText";
import Carousel from "react-native-reanimated-carousel";
import { Entypo } from "@expo/vector-icons";

type Props = {
  subQuestions: string[];
};

const VerticalQuestionSlider = ({ subQuestions }: Props) => {
  const [containerW, setContainerW] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerW(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {containerW > 0 && (
        <Carousel
          vertical
          loop
          width={containerW}
          height={40} // 질문 영역 높이
          data={subQuestions}
          scrollAnimationDuration={450}
          // 자동재생 원하면 아래 주석 해제
          autoPlay
          autoPlayInterval={2500}
          renderItem={({ item, index }) => {
            // loop 덕분에 index는 계속 증가 b 할 수 있으니, 표시용 번호는 모듈로 처리
            const displayIndex = (index % subQuestions.length) + 1;
            return (
              <View style={styles.slide}>
                <AppText style={styles.text}>
                  {displayIndex}. {item}
                </AppText>
              </View>
            );
          }}
        />
      )}
      <Entypo name="select-arrows" size={18} color="#5C4B44" />
    </View>
  );
};

export default VerticalQuestionSlider;

const styles = StyleSheet.create({
  wrap: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF7D4A",
  },
});
