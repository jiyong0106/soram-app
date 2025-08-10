import { StyleSheet, View } from "react-native";
import Description from "../components/index/Description";
import LoginButton from "../components/index/LoginButton";
import LogoHeader from "../components/index/LogoHeader";
import StartButton from "../components/index/StartButton";
import TermsNotice from "../components/index/TermsNotice";
import WelcomeImage from "../components/index/WelcomeImage";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <LogoHeader />
        <View style={styles.body}>
          <WelcomeImage />
          <Description />
          <TermsNotice />
          <StartButton />
          <LoginButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  body: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    gap: 10,
  },
});
