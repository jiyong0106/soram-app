import React, { PropsWithChildren, ReactNode } from "react";
import { View, ScrollView } from "react-native";
import useSafeArea from "@/utils/hooks/useSafeArea";
import StickyBottom from "@/components/common/StickyBottom";
import DismissKeyboardView from "@/components/common/DismissKeyboardView";

type ScreenWithStickyActionProps = PropsWithChildren<{
  action: ReactNode;
  horizontalPadding?: number;
  topPadding?: number;
  dismissKeyboardOnBlank?: boolean;
  scrollable?: boolean; // 한글 주석: 내용이 길 경우 스크롤 허용
}>;

const ScreenWithStickyAction = ({
  children,
  action,
  horizontalPadding = 15,
  topPadding = 15,
  dismissKeyboardOnBlank = true,
  scrollable = false,
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
        {scrollable ? (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: bottom + 20, // 버튼 높이+세이프 영역만큼 여백
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
      </DismissKeyboardView>
      <StickyBottom bottomInset={bottom}>{action}</StickyBottom>
    </View>
  );
};

export default ScreenWithStickyAction;
