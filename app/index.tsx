import { StyleSheet, View } from "react-native";
import Description from "../components/index/Description";
import RootHeader from "../components/index/RootHeader";
import StartButton from "../components/index/StartButton";
import TermsNotice from "../components/index/TermsNotice";
import WelcomeImage from "../components/index/WelcomeImage";
import PageContainer from "@/components/common/PageContainer";
import { LinearGradient } from "expo-linear-gradient";

const Index = () => {

  return (
    <PageContainer edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#FFB591", "#FFB591", "#FFB591", "#ffffff"]}
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "85%",
        }}
      />

      <View style={styles.container}>
        <RootHeader />
        <View style={styles.body}>
          <WelcomeImage />
          <View style={styles.content}>
            <Description />
            <TermsNotice />
            <StartButton />
          </View>
        </View>
      </View>
    </PageContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    gap: 10,
  },
});
