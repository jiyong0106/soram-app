//가이드 모달에 들어가야 할 내용
// 1. 소람소개
// 2. 원하는 주제 찾기
// 3. 대화연결

export const guideOptions = [
  {
    title: "소람소개",
    description:
      "소람은 다양한 주제를 통해 사용자의 내면과 이야기에 집중하여 진정성 있는 연결을 만드는 소셜 앱이에요.",
    image: require("@/assets/images/eximage.png"),
  },
  {
    title: "원하는 주제 찾기",
    description: "원하는 주제를 찾으면 대화를 시작할 수 있습니다.",
    image: require("@/assets/images/eximage.png"),
  },
  {
    title: "대화연결",
    description: "대화를 통해 진정한 만남을 시작해보세요.",
    image: require("@/assets/images/eximage.png"),
  },
] as const;



// 소람이 제공하는 랜덤 주제를 확인해보세요
// 마음에 드는 주제와 다른 사용자가 작성한 이야기를 확인할 수 있어요
// 공감이 가는 이야기가 있다면 대화를 통해 만나보세요!