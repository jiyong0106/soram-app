import { StyleProp, TextStyle, View } from "react-native";
import AppText from "./AppText";
import ScalePressable from "./ScalePressable";

const SheetRow = ({
  icon,
  label,
  onPress,
  labelStyle,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  labelStyle?: StyleProp<TextStyle>;
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
      <AppText style={[{ fontSize: 14, color: "#5C4B44" }, labelStyle]}>
        {label}
      </AppText>
    </View>
  </ScalePressable>
);

export default SheetRow;
