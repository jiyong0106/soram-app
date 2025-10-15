import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AppText from "@/components/common/AppText";
import ScalePressable from "../common/ScalePressable";

type Props = {
  title: string;
  expanded: boolean;
  onTitlePress: () => void; // 탭 접기/펼치기
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
