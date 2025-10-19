import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../common/Button";

type Props = {
  active: "mine" | "opponent";
  onChange: (t: "mine" | "opponent") => void;
};

// [수정] active prop은 받지만, 스타일링에는 사용하지 않습니다.
const ChatTriggerTabs = ({ active, onChange }: Props) => {
  return (
    <View style={s.tabs}>
      <View style={s.tab}>
        <Button
          label="내 이야기"
          onPress={() => onChange("mine")}
          // [핵심 수정] 고정 스타일 적용
          color={"#FFFFFF"} // 흰 배경
          textColor={"#FF7D4A"} // 검은 글씨
          borderColor={"#FF7D4A"} // 메인 컬러 테두리
          style={s.btn}
          // textStyle prop을 사용하여 글자 크기 오버라이드
          textStyle={{ fontSize: 14 }}
        />
      </View>
      <View style={s.tab}>
        <Button
          label="상대방의 이야기"
          onPress={() => onChange("opponent")}
          // [핵심 수정] 고정 스타일 적용
          color={"#FF6B3E"} // 메인 컬러 배경
          textColor={"#FFFFFF"} // 흰 글씨
          style={s.btn}
          // textStyle prop을 사용하여 글자 크기 오버라이드
          textStyle={{ fontSize: 14 }}
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
    borderRadius: 10,
  },
});
