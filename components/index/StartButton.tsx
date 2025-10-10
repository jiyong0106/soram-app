import { useRouter } from "expo-router";
import Button from "../common/Button";

const StartButton = () => {
  const router = useRouter();

  return (
    <Button
      label="시작하기"
      color="#FF6B3E" // 한글 주석: 주 테마 컬러 적용
      textColor="#fff"
      onPress={() => router.push("/(auth)")}
      style={{
        shadowColor: "#ff6b6b",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
      }}
    />
  );
};

export default StartButton;
