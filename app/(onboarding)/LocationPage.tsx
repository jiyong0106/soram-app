import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";

const LocationPage = () => {
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
          onPress={() => router.push("/(onboarding)/InterestsPage")}
        />
      }
    >
      <View style={styles.container}>
        <Text>LocationPage</Text>
        <Text>여긴 지역역 페이지지</Text>
      </View>
    </ScreenWithStickyAction>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
