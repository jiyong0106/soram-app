import { Image, StyleSheet, View } from "react-native";

const WelcomeImage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/test.png")}
        style={styles.image}
      />
    </View>
  );
};

export default WelcomeImage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 32,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
});
