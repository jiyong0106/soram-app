import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

const LoadingSpinner = ({ size = "small", color }: LoadingSpinnerProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
