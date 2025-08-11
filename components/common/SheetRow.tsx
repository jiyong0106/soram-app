import { TouchableOpacity, View, Text } from "react-native";

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
      <Text style={{ fontSize: 16 }}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default SheetRow;
