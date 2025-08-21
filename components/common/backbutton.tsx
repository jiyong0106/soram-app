import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export const BackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      activeOpacity={0.5}
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

export const backHeaderOptions = {
  headerBackVisible: false,
  headerLeft: () => <BackButton />,
};
