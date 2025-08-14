import { useSafeAreaInsets } from "react-native-safe-area-context";

const useSafeArea = () => {
  const insets = useSafeAreaInsets();
  return insets;
};
export default useSafeArea;
