import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "@/components/common/AppText";

type Props = {
  active: "mine" | "opponent";
  onChange: (t: "mine" | "opponent") => void;
};

const ChatTriggerTabs = ({ active, onChange }: Props) => {
  return (
    <View style={s.tabs}>
      <TouchableOpacity
        style={[s.tab, active === "mine" && s.tabActive]}
        onPress={() => onChange("mine")}
      >
        <AppText style={[s.tabText, active === "mine" && s.tabTextActive]}>
          나의 답변
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.tab, active === "opponent" && s.tabActive]}
        onPress={() => onChange("opponent")}
      >
        <AppText style={[s.tabText, active === "opponent" && s.tabTextActive]}>
          상대방의 답변
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default ChatTriggerTabs;

const s = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 8, marginBottom: 10 },
  tab: {
    flex: 1,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  tabActive: { backgroundColor: "#ff6b6b", borderColor: "#FFD6C2" },
  tabText: { color: "#6B7280", fontWeight: "700" },
  tabTextActive: { color: "#fff" },
});
