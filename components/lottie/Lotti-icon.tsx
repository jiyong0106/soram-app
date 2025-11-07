import LottieView from "lottie-react-native";
import { StyleProp, ViewStyle } from "react-native";

// 위치/크기는 컴포넌트 내부에서 고정
type LottieIconProps = {
  style: StyleProp<ViewStyle>;
};

export const Handtap = ({ style }: LottieIconProps) => {
  return (
    <LottieView
      source={require("@/assets/animations/Hand-tap.json")}
      autoPlay
      loop
      style={style}
    />
  );
};

export const ArrowDown = ({ style }: LottieIconProps) => {
  return (
    <LottieView
      source={require("@/assets/animations/Arrow-down.json")}
      autoPlay
      loop
      style={style}
    />
  );
};
