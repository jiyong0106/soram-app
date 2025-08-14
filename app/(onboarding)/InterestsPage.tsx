import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";

const InterestsPage = () => {
  const router = useRouter();
  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          // disabled={!isValid}
          style={styles.button}
          onPress={() => router.push("/(onboarding)/PersonalityPage")}
        />
      }
    >
      <View style={styles.container}>
        <Text>InterestsPage</Text>
        <Text>여긴 취향 페이지지</Text>
      </View>
    </ScreenWithStickyAction>
  );
};

export default InterestsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
