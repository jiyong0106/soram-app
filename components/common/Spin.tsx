import { Animated, StyleProp, ViewStyle } from "react-native";
import useInfiniteSpin from "@/utils/hooks/useInfiniteSpin";

type Props = {
  active?: boolean;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const Spin = ({ active = false, duration = 800, style, children }: Props) => {
  const { animatedStyle } = useInfiniteSpin(active, { duration });
  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};
export default Spin;
