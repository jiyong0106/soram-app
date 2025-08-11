import React, { PropsWithChildren } from "react";
import { LayoutChangeEvent, ViewStyle } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

type StickyBottomProps = PropsWithChildren<{
  style?: ViewStyle;
  onHeightChange?: (height: number) => void;
  bottomInset?: number;
}>;

const StickyBottom = ({
  children,
  style,
  onHeightChange,
  bottomInset = 0,
}: StickyBottomProps) => {
  const handleLayout = (e: LayoutChangeEvent) => {
    onHeightChange?.(e.nativeEvent.layout.height);
  };

  return (
    <KeyboardStickyView
      offset={{ closed: 0, opened: bottomInset }}
      style={style}
      onLayout={handleLayout}
    >
      {children}
    </KeyboardStickyView>
  );
};

export default StickyBottom;
