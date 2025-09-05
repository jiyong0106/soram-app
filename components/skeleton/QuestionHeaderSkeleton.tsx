import { StyleSheet, View } from "react-native";
import React from "react";

const QuestionHeaderSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* 제목 카드 */}
      <View style={styles.titleWrapper}>
        <View style={styles.qBox} />
        <View style={styles.titleBox} />
      </View>

      {/* 서브 질문 영역 (세로 슬라이더 자리) */}
      <View style={styles.subQWrapper}>
        <View style={styles.subQBox} />
      </View>
    </View>
  );
};

export default QuestionHeaderSkeleton;

const styles = StyleSheet.create({
  container: {
    // QuestionHeader와 동일 레이아웃
  },
  titleWrapper: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  qBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  titleBox: {
    width: 180,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  subQWrapper: {
    marginTop: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  subQBox: {
    width: 140,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
});
