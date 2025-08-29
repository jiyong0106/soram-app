import { useRouter } from "expo-router";
import Button from "../common/Button";

const LoginButton = () => {
  const router = useRouter();
  return (
    <Button
      label="바로들어감"
      color="#fff"
      textColor="#222"
      borderColor="#FF835C"
      onPress={() => router.replace("/topic")}
    />
  );
};

export default LoginButton;
