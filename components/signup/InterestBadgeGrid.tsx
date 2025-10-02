import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import InterestBadge from "./InterestBadge";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { useQuery } from "@tanstack/react-query";
import { getInterests } from "@/utils/api/authPageApi";
import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

// --- 아이콘 매핑 로직 (수정 없음) ---
type IconName = ComponentProps<typeof Ionicons>["name"];
const INTEREST_ICON_MAP: Record<string, IconName> = {
  재테크: "wallet",
  주식: "stats-chart",
  자동차: "car-sport",
  여행: "airplane",
  게임: "game-controller",
  "운동/스포츠": "baseball",
  뷰티: "sparkles",
  패션: "shirt",
  반려동물: "paw",
  "IT/전자기기": "laptop",
  쇼핑: "bag-handle",
  명품: "diamond",
  "문화/공연": "balloon",
  음악: "musical-notes",
  요리: "restaurant",
  영화: "film",
  독서: "book",
  어학: "language",
};
const DEFAULT_ICON: IconName = "heart";
const getIconForInterest = (interestName: string): IconName => {
  return INTEREST_ICON_MAP[interestName] || DEFAULT_ICON;
};
// --- 아이콘 매핑 로직 끝 ---

const InterestBadgeGrid = () => {
  const {
    data: interests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["interests"],
    queryFn: getInterests,
  });

  // [수정] 무한 루프를 방지하기 위해 각 상태와 함수를 개별적으로 구독합니다.
  const interestIds = useSignupDraftStore((state) => state.draft.interestIds);
  const patch = useSignupDraftStore((state) => state.patch);

  // [추가] 최대 선택 개수에 도달했는지 여부를 판단하는 변수
  const maxReached = interestIds.length >= 5;

  const toggle = (id: number) => {
    const isSelected = interestIds.includes(id);
    // [수정] maxReached 변수를 사용하여 로직을 더 명확하게 변경
    if (!isSelected && maxReached) {
      // 5개 꽉 찼는데 새로운 걸 선택하려는 경우, 아무것도 하지 않음
      return;
    }

    const nextIds = isSelected
      ? interestIds.filter((selectedId) => selectedId !== id)
      : [...interestIds, id];

    patch({ interestIds: nextIds });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>관심사를 불러오는 데 실패했습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {interests?.map((interest) => {
        const isSelected = interestIds.includes(interest.id);
        // [추가] 비활성화 여부를 결정하는 로직
        // 조건: 최대 개수에 도달했고(maxReached) && 현재 뱃지가 선택되지 않은 경우(!isSelected)
        const isDisabled = maxReached && !isSelected;

        return (
          <InterestBadge
            key={interest.id}
            tag={interest.name}
            iconName={getIconForInterest(interest.name)}
            selected={isSelected}
            onPress={() => toggle(interest.id)}
            // [추가] 계산된 disabled 상태를 prop으로 전달
            disabled={isDisabled}
          />
        );
      })}
    </View>
  );
};

export default InterestBadgeGrid;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
});
