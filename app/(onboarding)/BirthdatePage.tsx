import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";

const BirthdatePage = () => {
  const router = useRouter();
  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          // disabled={!isValid}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/LocationPage")}
        />
      }
    >
      <View style={styles.container}>
        <Text>BirthdatePage</Text>
        <Text>여긴 생일일 페이지지</Text>
      </View>
    </ScreenWithStickyAction>
  );
};

export default BirthdatePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
