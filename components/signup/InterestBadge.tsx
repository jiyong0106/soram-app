import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  /** 라벨 텍스트 */
  tag: string;
  /** 선택 여부 */
  selected?: boolean;
  /** 클릭 핸들러 */
  onPress?: () => void;
  /** 좌측 아이콘 이름(Ionicons) */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** [추가] 비활성화 여부 */
  disabled?: boolean;
}

const InterestBadge = ({
  tag,
  selected,
  onPress,
  iconName,
  disabled, // [추가] disabled prop 받기
}: Props) => {
  // [수정] disabled 상태에 따른 색상 정의 추가
  // 비활성화 상태: 매우 연한 회색 톤
  const DISABLED_COLOR = "#F2F2F7";

  // 상태에 따른 색상 결정 로직
  const backgroundColor = selected
    ? "#FFF1EF"
    : disabled
    ? DISABLED_COLOR
    : "#fff";
  const borderColor = selected
    ? "#FF6B6B"
    : disabled
    ? DISABLED_COLOR
    : "#E5E5EA";
  const textColor = selected
    ? "#FF6B6B"
    : disabled
    ? "#AEAEB2" // 비활성화 시 텍스트/아이콘 색상도 연하게
    : "#8E8E93";

  return (
    <Pressable
      // [수정] disabled 상태일 때는 onPress 이벤트가 동작하지 않도록 설정
      onPress={disabled ? undefined : onPress}
      style={[styles.container, { borderColor, backgroundColor }]}
    >
      <View style={styles.contentRow}>
        {iconName ? (
          <Ionicons
            name={iconName}
            size={18}
            color={textColor}
            style={{ marginRight: 6 }}
          />
        ) : null}
        <AppText style={[styles.label, { color: textColor }]}>{tag}</AppText>
      </View>
    </Pressable>
  );
};

export default InterestBadge;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
