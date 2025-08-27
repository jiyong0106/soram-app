import { StyleSheet, Text, View } from "react-native";
import AppText from "../common/AppText";

const TermsNotice = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.notice}>
        가입 시 <AppText style={styles.link}>이용약관</AppText> 및{" "}
        <AppText style={styles.link}>개인정보 취급방침</AppText>에 동의하게
        됩니다.
      </AppText>
    </View>
  );
};

export default TermsNotice;

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
