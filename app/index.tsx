import { Button, StyleSheet, View } from "react-native";
import Description from "../components/index/Description";
import LoginButton from "../components/index/LoginButton";
import LogoHeader from "../components/index/LogoHeader";
import StartButton from "../components/index/StartButton";
import TermsNotice from "../components/index/TermsNotice";
import WelcomeImage from "../components/index/WelcomeImage";
import PageContainer from "@/components/common/PageContainer";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  return (
    <PageContainer edges={["top", "bottom"]}>
      <View style={styles.container}>
        <LogoHeader />
        <View style={styles.body}>
          <WelcomeImage />
          <Description />
          <TermsNotice />
          <StartButton />
          {/* <LoginButton />
          <Button
            title="온보디 들어가기"
            onPress={() => router.push("/(signup)")}
          /> */}
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  body: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    gap: 10,
  },
});
