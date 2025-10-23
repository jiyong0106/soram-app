import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../common/Button";
import AppText from "../common/AppText";

type Props = {
  active: "mine" | "opponent";
  onChange: (t: "mine" | "opponent") => void;
  topicTitle: string;
};

// [수정] active prop은 받지만, 스타일링에는 사용하지 않습니다.
const ChatTriggerTabs = ({ active, onChange, topicTitle }: Props) => {
  return (
    // 전체를 View로 감싸서 제목과 탭 포함
    <View>
      {/* 주제 제목(topicTitle) 표시하는 UI 추가 (ChatTriggerSheet 스타일 참고) */}
      <View style={s.titleContainer}>
        <AppText style={s.titleText} numberOfLines={2}>
          "{topicTitle}"
        </AppText>
      </View>
      <View style={s.tabs}>
        <View style={s.tab}>
          <Button
            label="내 이야기"
            onPress={() => onChange("mine")}
            color={"#FFFFFF"}
            textColor={"#FF7D4A"}
            borderColor={"#FF7D4A"}
            style={s.btn}
            textStyle={{ fontSize: 12 }}
          />
        </View>
        <View style={s.tab}>
          <Button
            label="상대방의 이야기"
            onPress={() => onChange("opponent")}
            color={"#FF6B3E"}
            textColor={"#FFFFFF"}
            style={s.btn}
            textStyle={{ fontSize: 12 }}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatTriggerTabs;

const s = StyleSheet.create({
  // 제목 표시에 필요한 스타일 추가
  titleContainer: {
    marginBottom: 20, // 버튼과 간격
  },
  titleText: {
    color: "#5C4B44",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 22,
    alignSelf: "center",
  },
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
