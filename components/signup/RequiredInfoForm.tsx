import { StyleSheet } from "react-native";
import AppText from "../common/AppText";
import ScalePressable from "../common/ScalePressable";

interface Props {
  optional?: boolean;
  onPress?: () => void;
}

const RequiredInfoForm = ({ optional, onPress }: Props) => {
  return (
    <ScalePressable
      style={[styles.container, optional && styles.containerOptional]}
      onPress={onPress}
    >
      <AppText style={optional && styles.requiredOptional}>
        질문을 선택해 주세요
      </AppText>
      <AppText style={[styles.required, optional && styles.requiredOptional]}>
        {optional ? "(선택)" : "(필수)"}
      </AppText>
    </ScalePressable>
  );
};

export default RequiredInfoForm;

const styles = StyleSheet.create({
  // 필수 질문일 경우

  container: {
    backgroundColor: "#FFF8F5", // 연한 배경
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF6B3E", // 강조 오렌지톤
    height: 70,
    justifyContent: "center",
    gap: 4,
    alignItems: "center",
    flexDirection: "row",
  },
  required: {
    color: "#E63946", // 선명한 레드
    fontWeight: "600", // 강조
  },

  // 선택 질문일 경우
  containerOptional: {
    borderColor: "#D0D7DE", // 은은한 블루 그레이
    borderStyle: "dashed",
  },
  requiredOptional: {
    color: "#6B7280", // 텍스트 그레이
  },
});
