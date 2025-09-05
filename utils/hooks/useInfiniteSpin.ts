// utils/hooks/useInfiniteSpin.ts
import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";

type Options = {
  duration?: number;
  easing?: any; // EasingFunction
  useNativeDriver?: boolean;
};

const useInfiniteSpin = (active: boolean, opts: Options = {}) => {
  const {
    duration = 800,
    easing = Easing.linear,
    useNativeDriver = true,
  } = opts;

  const value = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const start = () => {
    loopRef.current?.stop();
    loopRef.current = Animated.loop(
      Animated.timing(value, { toValue: 1, duration, easing, useNativeDriver })
    );
    loopRef.current.start();
  };

  const stop = () => {
    loopRef.current?.stop();
    value.stopAnimation();
    value.setValue(0);
  };

  useEffect(() => {
    if (active) start();
    else stop();
    return stop; // cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration, easing, useNativeDriver]);

  const rotate = value.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const animatedStyle = useMemo(() => ({ transform: [{ rotate }] }), [rotate]);

  return { animatedStyle, start, stop, value };
};

export default useInfiniteSpin;
