import { StyleSheet, View } from "react-native";
import InterestBadge from "./InterestBadge";
import { useEffect, useMemo, useState } from "react";

interface Props {
  /** 선택된 태그 변경 시 상위로 전달 */
  onChangeSelected?: (tags: string[]) => void;
  /** 초기 선택 값 */
  initialSelected?: string[];
}

const InterestBadgeGrid = ({ onChangeSelected, initialSelected }: Props) => {
  // 표시할 관심사 목록과 아이콘 매핑
  const options = useMemo(
    () => [
      { tag: "재테크", icon: "wallet" as const },
      { tag: "주식", icon: "stats-chart" as const },
      { tag: "자동차", icon: "car" as const },
      { tag: "여행", icon: "bag" as const },
      { tag: "게임", icon: "game-controller" as const },
      { tag: "운동/스포츠", icon: "baseball" as const },
      { tag: "뷰티", icon: "sparkles" as const },
      { tag: "패션", icon: "shirt" as const },
      { tag: "반려동물", icon: "paw" as const },
      { tag: "전자기기", icon: "laptop" as const },
      { tag: "쇼핑", icon: "bag-handle" as const },
      { tag: "명품", icon: "diamond" as const },
      { tag: "문화/공연", icon: "balloon" as const },
      { tag: "음악", icon: "musical-notes" as const },
      { tag: "요리", icon: "restaurant" as const },
      { tag: "영화", icon: "film" as const },
      { tag: "독서", icon: "book" as const },
      { tag: "어학", icon: "language" as const },
    ],
    []
  );

  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    (initialSelected || []).reduce<Record<string, boolean>>((acc, cur) => {
      acc[cur] = true;
      return acc;
    }, {})
  );

  const toggle = (key: string) => {
    setSelected((prev) => {
      const isSelected = !!prev[key];
      // 현재 선택된 개수
      const selectedCount = Object.values(prev).filter(Boolean).length;
      // 이미 선택된 것을 해제하는 경우는 허용
      if (isSelected) {
        return { ...prev, [key]: false };
      }
      // 새로 선택하려는 경우: 5개 제한 체크
      if (selectedCount >= 5) {
        return prev; // 5개를 넘기면 변화 없음
      }
      return { ...prev, [key]: true };
    });
  };

  // 선택 변경 시 상위 콜백 호출
  useEffect(() => {
    const tags = Object.keys(selected).filter((k) => selected[k]);
    onChangeSelected?.(tags);
  }, [selected, onChangeSelected]);

  return (
    <View style={styles.grid}>
      {options.map((opt) => (
        <InterestBadge
          key={opt.tag}
          tag={opt.tag}
          iconName={opt.icon}
          selected={!!selected[opt.tag]}
          onPress={() => toggle(opt.tag)}
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
});
