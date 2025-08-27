import { TouchableOpacity, View } from "react-native";
import AppText from "./AppText";

const SheetRow = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
    <View
      style={{
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      {icon}
      <AppText style={{ fontSize: 16 }}>{label}</AppText>
    </View>
  </TouchableOpacity>
);

export default SheetRow;
