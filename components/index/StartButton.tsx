import { useRouter } from "expo-router";
import Button from "../common/Button";

const StartButton = () => {
  const router = useRouter();

  return (
    <Button
      label="시작하기"
      color="#FF6F3C"
      textColor="#fff"
      onPress={() => router.push("/(signup)")}
    />
  );
};

export default StartButton;
