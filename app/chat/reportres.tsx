import { StyleSheet, View } from "react-native";
import React from "react";
import PageContainer from "@/components/common/PageContainer";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import AppText from "@/components/common/AppText";

const Reportres = () => {
  const router = useRouter();
  const handlePress = () => {
    router.replace("/chat");
  };

  return (
    <PageContainer edges={["top"]} padded={false}>
      <ScreenWithStickyAction
        action={
          <Button
            label="돌아가기"
            color="#ff6b6b"
            textColor="#fff"
            style={styles.button}
            onPress={handlePress}
          />
        }
      >
        <View style={styles.container}>
          <AppText>신고 완료되었습니다.</AppText>
          <AppText>24시간 이내 검토 후 처리될 예정입니다.</AppText>
        </View>
      </ScreenWithStickyAction>
    </PageContainer>
  );
};

export default Reportres;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
