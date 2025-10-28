//가이드 모달에 들어가야 할 내용
// 1. 소람소개
// 2. 원하는 주제 찾기
// 3. 대화연결

export const guideOptions = [
  {
    title: "랜덤 주제",
    description: "소람이 제공하는 다양한 랜덤 주제를 확인해보세요.",
    image: require("@/assets/images/eximage.png"),
  },
  {
    title: "원하는 주제 찾기",
    description:
      "마음에 드는 주제와 다른 사용자가 남긴 이야기를 함께 살펴보세요.",
    image: require("@/assets/images/eximage.png"),
  },
  {
    title: "대화로 연결되기",
    description:
      "공감되는 이야기가 있다면, 대화를 통해 진정한 연결을 시작해보세요.",
    image: require("@/assets/images/eximage.png"),
  },
] as const;

// 소람이 제공하는 랜덤 주제를 확인해보세요
// 마음에 드는 주제와 다른 사용자가 작성한 이야기를 확인할 수 있어요
// 공감이 가는 이야기가 있다면 대화를 통해 만나보세요!
