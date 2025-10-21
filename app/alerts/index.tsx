import { StyleSheet, Text, View } from "react-native";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";
import { BackButton } from "@/components/common/backbutton";

const AlertsPage = () => {
  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: "설정",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        <Text>index</Text>
      </View>
    </PageContainer>
  );
};

export default AlertsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});
