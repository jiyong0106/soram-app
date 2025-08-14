import { useRouter } from "expo-router";
import Button from "../common/Button";

const StartButton = () => {
  const router = useRouter();

  return (
    <Button
      label="시작하기"
      color="#ff6b6b"
      textColor="#fff"
      onPress={() => router.push("/(auth)")}
    />
  );
};

export default StartButton;
