import React, { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import useSafeArea from "@/utils/hooks/useSafeArea";
import StickyBottom from "@/components/common/StickyBottom";
import DismissKeyboardView from "@/components/common/DismissKeyboardView";

type ScreenWithStickyActionProps = PropsWithChildren<{
  action: ReactNode;
  horizontalPadding?: number;
  topPadding?: number;
  dismissKeyboardOnBlank?: boolean;
}>;

const ScreenWithStickyAction = ({
  children,
  action,
  horizontalPadding = 15,
  topPadding = 15,
  dismissKeyboardOnBlank = true,
}: ScreenWithStickyActionProps) => {
  const { bottom } = useSafeArea();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: horizontalPadding,
        paddingTop: topPadding,
      }}
    >
      <DismissKeyboardView disabled={!dismissKeyboardOnBlank}>
        <View style={{ flex: 1 }}>{children}</View>
      </DismissKeyboardView>
      <StickyBottom bottomInset={bottom}>{action}</StickyBottom>
    </View>
  );
};

export default ScreenWithStickyAction;
