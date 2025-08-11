import useSafeArea from "@/hooks/useSafeArea";
import React, { PropsWithChildren } from "react";
import { LayoutChangeEvent, ViewStyle } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

type StickyBottomProps = PropsWithChildren<{
  style?: ViewStyle;
  onHeightChange?: (height: number) => void;
}>;

const StickyBottom = ({
  children,
  style,
  onHeightChange,
}: StickyBottomProps) => {
  
  const { bottom } = useSafeArea();

  const handleLayout = (e: LayoutChangeEvent) => {
    onHeightChange?.(e.nativeEvent.layout.height);
  };

  return (
    <KeyboardStickyView
      offset={{ closed: 0, opened: bottom }}
      style={style}
      onLayout={handleLayout}
    >
      {children}
    </KeyboardStickyView>
  );
};

export default StickyBottom;
