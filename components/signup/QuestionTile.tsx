import { StyleSheet, View } from "react-native";
import ScalePressable from "../common/ScalePressable";
import AppText from "../common/AppText";

type Variant = "required" | "optional";

interface Props {
  variant: Variant;
  label: string; // "1. 인생의 목표는 무엇인가요?" 같은 문구
  onPress?: () => void;
}

const QuestionTile = ({ variant, label, onPress }: Props) => {
  const isOptional = variant === "optional";
  return (
    <ScalePressable
      style={[styles.container, isOptional && styles.containerOptional]}
      onPress={onPress}
    >
      {/* 좌측 체크/순번 영역 등 확장 여지 */}
      <View style={{ flex: 1 }}>
        <AppText style={[styles.label, isOptional && styles.gray]}>
          {label}
        </AppText>
      </View>
      <AppText style={[styles.badge, isOptional && styles.gray]}>
        {isOptional ? "(선택)" : "(필수)"}
      </AppText>
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
