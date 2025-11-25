import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
const WelcomeImage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/main-re2.png")}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
};

export default WelcomeImage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 50,
  },
  image: {
    width: 300,
    height: 300,
  },
});
