import { StyleSheet, Text, View } from "react-native";
import AppText from "../common/AppText";

const Description = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>내 기준에 꼭 맞는</AppText>
      <AppText style={styles.textHighlight}>소중한 만남의 연결</AppText>
      <AppText style={styles.text}>인연 큐레이터 소람</AppText>
    </View>
  );
};

export default Description;

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    alignItems: "flex-start",
    paddingHorizontal: 5,
    gap: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#222",
  },
  textHighlight: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FF6B3E", // 한글 주석: 주 테마 컬러로 키워드 강조
  },
});
