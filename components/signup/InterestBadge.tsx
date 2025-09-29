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
}

const InterestBadge = ({ tag, selected, onPress, iconName }: Props) => {
  // 선택/비선택에 따른 색상 정의
  // 비선택: 회색 톤, 선택: 코랄(#FF6B6B) 톤
  const backgroundColor = selected ? "#FFF1EF" : "#fff";
  const borderColor = selected ? "#FF6B6B" : "#E5E5EA";
  const textColor = selected ? "#FF6B6B" : "#8E8E93";

  return (
    <Pressable
      onPress={onPress}
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
