import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import PageContainer from "@/components/common/PageContainer";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import ScalePressable from "@/components/common/ScalePressable";
import { postUserBlock } from "@/utils/api/chatPageApi";
import useAlert from "@/utils/hooks/useAlert";

const Reportres = () => {
  // 체크 상태 관리 (UI만, 실제 차단 로직 없음)
  const [isBlockedSelected, setIsBlockedSelected] = useState(false);
  const { peerUserId } = useLocalSearchParams<{
    peerUserId: string;
  }>();
  const blockedId = Number(peerUserId);
  const router = useRouter();
  const { showAlert } = useAlert();
  const handlePress = async () => {
    if (isBlockedSelected) {
      try {
        await postUserBlock(blockedId);
      } catch (error: any) {
        showAlert(error.response?.data?.message || "차단 실패");
      }
    }
    router.replace("/chat");
  };
  const handleToggleBlockSelect = () => {
    setIsBlockedSelected((prev) => !prev);
  };

  return (
    <PageContainer edges={["top"]} padded={false}>
      <ScreenWithStickyAction
        action={
          <Button
            label="확인"
            color="#FF6B3E"
            textColor="#fff"
            style={styles.button}
            onPress={handlePress}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.hedaer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={70}
              color="#FF6B3E"
            />
            <AppText>신고 완료되었습니다.</AppText>
            <AppText>24시간 이내 검토 후 처리될 예정입니다.</AppText>
          </View>
          <ScalePressable
            style={styles.content}
            onPress={handleToggleBlockSelect}
          >
            <View
              style={[
                styles.checkmark,
                isBlockedSelected && styles.checkmarkActive,
              ]}
            >
              {isBlockedSelected && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </View>
            <AppText>해당 유저 차단하기</AppText>
          </ScalePressable>
        </View>
      </ScreenWithStickyAction>
    </PageContainer>
  );
};

export default Reportres;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    marginTop: 32,
  },
  hedaer: {
    alignItems: "center",
    gap: 10,
    marginTop: 50,
  },
  content: {
    marginTop: 40,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF6B3E",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkActive: {
    backgroundColor: "#FF6B3E",
    borderColor: "#FF6B3E",
  },
});
