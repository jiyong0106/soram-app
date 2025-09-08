import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import { View, Text, StyleSheet, Alert } from "react-native";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";

const PersonalityPage = () => {
  const router = useRouter();
  const handlePress = () => {
    Alert.alert("", "프로필 입력 완료!", [
      {
        text: "확인",
        onPress: () => router.push("/(tabs)/topic"),
      },
    ]);
  };
  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#ff6b6b"
          textColor="#fff"
          // disabled={!isValid}
          style={styles.button}
          onPress={handlePress}
        />
      }
    >
      <View style={styles.container}>
        <Text>PersonalityPage</Text>
        <Text>여긴 성향향 페이지지</Text>
      </View>
    </ScreenWithStickyAction>
  );
};

export default PersonalityPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
