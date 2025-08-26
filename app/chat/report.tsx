import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import PageContainer from "@/components/common/PageContainer";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BackButton } from "@/components/common/backbutton";
import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import ReportReasonSelector from "@/components/chat/ReportReasonSelector";
import ReportDetailsInput from "@/components/chat/ReportDetailsInput";
import { REASON_LABELS, ReportReasonType } from "@/utils/types/common";
import StickyBottom from "@/components/common/StickyBottom";
import { useSafeArea } from "react-native-safe-area-context";
import { posetUserReport } from "@/utils/api/chatPageApi";
import useAlert from "@/utils/hooks/useAlert";

const ReportPage = () => {
  // UI state
  const [reason, setReason] = useState<ReportReasonType | null>(null);
  const [details, setDetails] = useState<string>("");
  const [inputBarHeight, setInputBarHeight] = useState(40);
  const { bottom } = useSafeArea();
  // 간단한 검증: 사유 선택 + 상세 최소 10자 (OTHER가 아니면 0자 허용하려면 규칙 바꾸면 됨)
  const minDetailLen = reason === "OTHER" ? 5 : 0; // 정책: 기타는 최소 5자
  const isValid = !!reason && details.trim().length >= minDetailLen;
  const { peerUserId } = useLocalSearchParams<{
    peerUserId: string;
  }>();
  const router = useRouter();
  const { showAlert, showActionAlert } = useAlert();

  const handlePress = () => {
    const body = {
      reportedId: Number(peerUserId),
      type: "USER_PROFILE" as const,
      targetId: peerUserId,
      reason: reason!,
      details: details,
    };
    showActionAlert("해당 유저를 신고하시나요?", "신고", async () => {
      try {
        const res = await posetUserReport(body);
        router.dismissAll();
        router.replace("/chat/reportres");
      } catch (e: any) {
        if (e) {
          showAlert(e.response.data.message);
          return;
        }
      }
    });
  };

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: "신고",
          headerShown: true,
          headerBackVisible: false,

          headerLeft: () => <BackButton />,
        }}
      />

      <ScreenWithStickyAction
        action={
          <Button
            label="신고하기"
            color="#ff6b6b"
            textColor="#fff"
            disabled={!isValid}
            style={styles.button}
            onPress={handlePress}
          />
        }
      >
        <View style={styles.container}>
          <StickyBottom
            style={{ backgroundColor: "#fff" }}
            onHeightChange={(h) => setInputBarHeight(h)}
            bottomInset={bottom}
          >
            <ReportReasonSelector value={reason} onChange={setReason} />
            <ReportDetailsInput
              value={details}
              onChangeText={setDetails}
              minLen={minDetailLen}
              maxLen={1000}
              placeholder={
                reason === "OTHER"
                  ? "자세한 내용을 입력해 주세요. (최소 5자)"
                  : "상세 내용을 적어주세요. (선택)"
              }
              helperText={
                reason
                  ? `선택된 사유: ${REASON_LABELS[reason]}`
                  : "신고 사유를 먼저 선택해 주세요."
              }
            />
          </StickyBottom>
        </View>
      </ScreenWithStickyAction>
    </PageContainer>
  );
};

export default ReportPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
});
