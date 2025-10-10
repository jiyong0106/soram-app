import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import * as Linking from "expo-linking";

const TermsNotice = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.notice} numberOfLines={1} ellipsizeMode="tail">
        가입 시{` `}
        <AppText
          style={styles.link}
          onPress={() =>
            Linking.openURL(`${process.env.EXPO_PUBLIC_WEB_URL}/terms`)
          }
        >
          이용약관
        </AppText>
        {` `}및{` `}
        <AppText
          style={styles.link}
          onPress={() =>
            Linking.openURL(`${process.env.EXPO_PUBLIC_WEB_URL}/privacy`)
          }
        >
          개인정보 처리방침
        </AppText>
        {` `}에 동의하게 됩니다.
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
