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
  const containerStyle = [
    styles.container,
    isOptional && !isEmphasis && styles.containerOptional,
    // checked가 true일 때, 완료 스타일(containerChecked)을 적용
    checked && styles.containerChecked,
  ];
  const textStyle = [styles.label, isOptional && !isEmphasis && styles.gray];
  const badgeStyle = [styles.badge, isOptional && !isEmphasis && styles.gray];

  return (
    <ScalePressable style={containerStyle} onPress={onPress}>
      {/* 좌측 체크/순번 영역 등 확장 여지 */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        <Ionicons
          name={checked ? "checkmark-circle" : "ellipse-outline"}
          size={18}
          color={checked ? "#FF7D4A" : "#B0A6A0"}
        />
        <View style={{ flex: 1 }}>
          <AppText style={[textStyle, { flexShrink: 1 }]}>{label}</AppText>
        </View>
      </View>
      <AppText style={badgeStyle}>{isOptional ? "(선택)" : "(필수)"}</AppText>
    </ScalePressable>
  );
};

export default QuestionTile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D7DE",
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
  // 답변 완료(checked) 상태일 때 적용될 스타일
  containerChecked: {
    // 체크마크 색상(#10B981)과 잘 어울리는 은은한 녹색 배경
    backgroundColor: "#FFF3EC",
    // 테두리 색상도 체크마크와 통일하여 완료 상태를 강조
    borderColor: "#FF7D4A",
  },
  // --- ⬆️ 여기까지 추가되었습니다 ⬆️ ---
  label: { color: "#5C4B44", fontSize: 14 },
  badge: { color: "#FF7D4A" },
  gray: { color: "#5C4B44" },
});
