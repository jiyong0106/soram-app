import { StyleSheet, Text, View } from "react-native";

const Description = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>내 기준에 꼭 맞는</Text>
      <Text style={styles.text}>소중한 만남의 연결 </Text>
      <Text style={styles.text}>인연 큐레이터 소람</Text>
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
});
