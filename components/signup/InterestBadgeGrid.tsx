import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import InterestBadge from "./InterestBadge";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import { useQuery } from "@tanstack/react-query";
import { getInterests } from "@/utils/api/authPageApi";

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

  const toggle = (id: number) => {
    // 이 부분의 로직은 이전과 동일하므로 수정하지 않습니다.
    const isSelected = interestIds.includes(id);
    const selectedCount = interestIds.length;
    let nextIds: number[];

    if (isSelected) {
      nextIds = interestIds.filter((selectedId) => selectedId !== id);
    } else {
      if (selectedCount >= 5) {
        return;
      }
      nextIds = [...interestIds, id];
    }
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
      {interests?.map((interest) => (
        <InterestBadge
          key={interest.id}
          tag={interest.name}
          iconName={"heart"}
          selected={interestIds.includes(interest.id)}
          onPress={() => toggle(interest.id)}
        />
      ))}
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
