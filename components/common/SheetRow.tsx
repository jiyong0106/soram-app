import { View } from "react-native";
import AppText from "./AppText";
import ScalePressable from "./ScalePressable";

const SheetRow = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) => (
  <ScalePressable onPress={onPress}>
    <View
      style={{
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      {icon}
      <AppText style={{ fontSize: 16, color: "#5C4B44" }}>{label}</AppText>
    </View>
  </ScalePressable>
);

export default SheetRow;
