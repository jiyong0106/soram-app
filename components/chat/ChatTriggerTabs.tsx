import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../common/Button";

type Props = {
  active: "mine" | "opponent";
  onChange: (t: "mine" | "opponent") => void;
};

const ChatTriggerTabs = ({ onChange }: Props) => {
  return (
    <View style={s.tabs}>
      <View style={s.tab}>
        <Button
          label="나의 답변"
          onPress={() => onChange("mine")}
          color={"#ff6b6b"}
          textColor="#fff"
          style={s.btn}
        />
      </View>
      <View style={s.tab}>
        <Button
          label="상대방의 답변"
          onPress={() => onChange("opponent")}
          color={"#ff6b6b"}
          textColor="#fff"
          style={s.btn}
        />
      </View>
    </View>
  );
};

export default ChatTriggerTabs;

const s = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
  },
  btn: {
    height: 40,
  },
});
