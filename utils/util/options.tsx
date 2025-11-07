import React from "react";
import { ArrowDown, Handtap } from "@/components/lottie/Lotti-icon";

export type GuideOption = {
  title: string;
  description: string;
  image: any;
  lottie?: React.ReactNode;
};

export const guideOptions = [
  {
    title: "랜덤 주제",
    description: "소람이 제공하는 다양한 랜덤 주제를 확인해보세요.",
    image: require("@/assets/images/guide1.png"),
    lottie: (
      <Handtap
        style={[
          {
            width: 70,
            height: 70,
            position: "absolute",
            top: 10,
            right: 20,
          },
        ]}
      />
    ),
  },
  {
    title: "원하는 주제 찾기",
    description:
      "마음에 드는 주제와 다른 사용자가 남긴 이야기를 함께 살펴보세요.",
    image: require("@/assets/images/guide2.png"),
    lottie: (
      <ArrowDown
        style={{
          width: 100,
          height: 100,
          position: "absolute",
          top: 30,
          right: 0,
        }}
      />
    ),
  },
  {
    title: "대화로 연결되기",
    description:
      "공감되는 이야기가 있다면, 대화를 통해 진정한 연결을 시작해보세요.",
    image: require("@/assets/images/guide3.png"),
  },
] satisfies readonly GuideOption[];

// 소람이 제공하는 랜덤 주제를 확인해보세요
// 마음에 드는 주제와 다른 사용자가 작성한 이야기를 확인할 수 있어요
// 공감이 가는 이야기가 있다면 대화를 통해 만나보세요!
