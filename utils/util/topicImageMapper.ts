import { Category } from "@/utils/types/topic"; // 기존 Category 타입 활용

// React Native는 require 경로가 정적이어야 하므로, 모든 이미지를 미리 로드합니다.
const topicImageMap: Record<string | Category, any> = {
  여행: require("@/assets/topicImages/travel.png"),
  음식: require("@/assets/topicImages/food.png"),
  영화: require("@/assets/topicImages/movie.png"),
  음악: require("@/assets/topicImages/music.png"),
  책: require("@/assets/topicImages/book.png"),
  운동: require("@/assets/topicImages/health.png"),
  일상: require("@/assets/topicImages/daily.png"),
  미래: require("@/assets/topicImages/future.png"),
  "밸런스 게임": require("@/assets/topicImages/balance.png"),
  경험: require("@/assets/topicImages/experience.png"),
  관계: require("@/assets/topicImages/relations.png"),
  유머: require("@/assets/topicImages/humor.png"),
  추억: require("@/assets/topicImages/memory.png"),
  사랑: require("@/assets/topicImages/love.png"),
  상상: require("@/assets/topicImages/imagination.png"),
  생각: require("@/assets/topicImages/mind.png"),
  default: require("@/assets/topicImages/default.png"),
};

/**
 * 카테고리 문자열에 해당하는 정적 이미지 리소스를 반환합니다.
 * @param category - TopicListType에서 받은 카테고리 문자열
 * @returns require()로 로드된 이미지 소스
 */
export const getTopicImageByCategory = (category: string): any => {
  // 정확히 일치하는 카테고리 이미지가 있으면 그것을 반환합니다.
  if (topicImageMap[category]) {
    return topicImageMap[category];
  }
  // 없다면 'default' 이미지를 반환합니다.
  return topicImageMap["default"];
};
