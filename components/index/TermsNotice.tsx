import { StyleSheet, Text, View } from "react-native";

export default function TermsNotice() {
  return (
    <View style={styles.container}>
      <Text style={styles.notice}>
        가입 시 <Text style={styles.link}>이용약관</Text> 및{" "}
        <Text style={styles.link}>개인정보 취급방침</Text>에 동의하게 됩니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  notice: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
    color: "#888",
  },
});
