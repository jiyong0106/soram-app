import React, { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PageContainerProps = PropsWithChildren<{
  edges?: ("top" | "bottom" | "left" | "right")[];
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  backgroundColor?: string;
}>;

const PageContainer = ({
  children,
  edges = ["top"],
  style,
  padded = true,
  backgroundColor = "#fff",
}: PageContainerProps) => {
  return (
    <SafeAreaView
      edges={edges}
      style={[
        { flex: 1, backgroundColor, paddingHorizontal: padded ? 15 : 0 },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};
export default PageContainer;
