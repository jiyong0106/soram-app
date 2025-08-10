import { useRootNavigationState, useRouter } from "expo-router";
import Button from "../common/Button";

const LoginButton = () => {
  const router = useRouter();
  return (
    <Button
      label="로그인"
      color="#fff"
      textColor="#222"
      borderColor="#FF835C"
      onPress={() => router.replace("/chatList")}
    />
  );
};

export default LoginButton;
