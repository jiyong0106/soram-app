import { StyleSheet, View } from "react-native";
import ScalePressable from "../common/ScalePressable";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

// 한글 주석: 시각 톤 정의 - default(선택 톤), emphasis(필수 톤)
type Tone = "default" | "emphasis";

type Variant = "required" | "optional";

interface Props {
  variant: Variant;
  label: string; // "1. 인생의 목표는 무엇인가요?" 같은 문구
  onPress?: () => void;
  tone?: Tone; // 한글 주석: 시각 톤(선택 질문이 답변 완료 시 필수와 같은 톤으로 표시)
  checked?: boolean; // 한글 주석: 답변 완료 여부
}

const QuestionTile = ({
  variant,
  label,
  onPress,
  tone = "default",
  checked,
}: Props) => {
  const isOptional = variant === "optional";
  const isEmphasis = tone === "emphasis";
  //  선택이지만 강조 톤이면 필수와 동일한 스타일 적용
  const containerStyle = [
    styles.container,
    isOptional && !isEmphasis && styles.containerOptional,
  ];
  const textStyle = [styles.label, isOptional && !isEmphasis && styles.gray];
  const badgeStyle = [styles.badge, isOptional && !isEmphasis && styles.gray];

  return (
    <ScalePressable style={containerStyle} onPress={onPress}>
      {/* 좌측 체크/순번 영역 등 확장 여지 */}
      <View
        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Ionicons
          name={checked ? "checkmark-circle" : "ellipse-outline"}
          size={18}
          color={checked ? "#10B981" : "#B0A6A0"}
        />

        <AppText style={textStyle}>{label}</AppText>
      </View>
      <AppText style={badgeStyle}>{isOptional ? "(선택)" : "(필수)"}</AppText>
    </ScalePressable>
  );
};

export default QuestionTile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F5",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF6B3E",
    minHeight: 70,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  containerOptional: {
    borderColor: "#D0D7DE",
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
  },
  label: { color: "#111827", fontSize: 15 },
  badge: { color: "#E63946", fontWeight: "600" },
  gray: { color: "#6B7280" },
});
