// src/components/common/AppText.tsx
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

// 굵기별로 매핑
const fontMap: Record<string, string> = {
  normal: "nsnReg",
  bold: "nsnBold",
  // 필요하면 더 추가
};

const AppText = (props: TextProps) => {
  const { style, ...rest } = props;

  // style이 배열일 수도 있으니까 전부 풀어서 object로 병합
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style || {};
  const { fontWeight, ...restStyle } = flatStyle as TextStyle;

  // fontWeight → fontFamily 매핑
  const fontFamily = fontWeight ? fontMap[fontWeight] || "nsnReg" : "nsnReg";

  return <Text {...rest} style={[{ fontFamily }, restStyle]} />;
};
export default AppText;
