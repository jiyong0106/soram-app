// app\components\chat\ChatTriggerHeader.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AppText from "@/components/common/AppText";
import ScalePressable from "../common/ScalePressable";

type Props = {
  title: string;
  expanded: boolean;
  onTitlePress: () => void;
};

const ChatTriggerHeader = ({ title, expanded, onTitlePress }: Props) => {
  return (
    <ScalePressable style={s.header} onPress={onTitlePress}>
      <Feather name="link" size={14} color="#5C4B44" />
      <AppText style={s.headerText}>{title}</AppText>
      <View>
        {expanded ? (
          <Ionicons name="chevron-up-outline" size={20} color="#FF7D4A" />
        ) : (
          <Ionicons name="chevron-down-outline" size={20} color="#FF7D4A" />
        )}
      </View>
    </ScalePressable>
  );
};

export default ChatTriggerHeader;

// 변경점: 스타일 객체는 그대로 유지됩니다.
// 부모 컴포넌트의 overflow: 'hidden'에 의해 모서리가 예쁘게 잘리므로,
// 이 컴포넌트에서 직접 모서리를 제어할 필요가 없어졌습니다.
const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    gap: 4,
  },
  headerText: { color: "#5C4B44" },
});
