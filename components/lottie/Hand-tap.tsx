import LottieView from "lottie-react-native";

const HandTap = () => {
  return (
    <LottieView
      source={require("@/assets/animations/Hand-tap.json")}
      autoPlay
      style={{
        width: 200,
        height: 200,
        backgroundColor: "#eee",
      }}
    />
  );
};

export default HandTap;
