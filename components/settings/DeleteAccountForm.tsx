import React, { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "@/components/common/AppText";
import useAlert from "@/utils/hooks/useAlert";
import { deleteAccount } from "@/utils/api/profilePageApi";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/utils/store/useAuthStore";
import Button from "../common/Button";

const quickReasons = [
  "더 이상 사용하지 않음",
  "사용성이 불편함",
  "개인정보/보안 우려",
  "콘텐츠 부족",
];

const DeleteAccountForm = () => {
  // 입력 상태
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // 유틸
  const { showAlert, showActionAlert } = useAlert();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  // 입력 유효성
  const canSubmit = useMemo(
    () => reason.trim().length > 0 && !loading,
    [reason, loading]
  );

  // 빠른 사유 선택
  const onPickQuick = useCallback((text: string) => {
    setReason(text);
  }, []);

  // 삭제 처리
  const onSubmit = useCallback(() => {
    if (!canSubmit) return;
    Keyboard.dismiss();
    showActionAlert(
      "정말로 계정을 삭제하시겠어요?\n삭제 후에는 복구가 불가능합니다.",
      "삭제",
      async () => {
        setLoading(true);
        try {
          await deleteAccount({ reason: reason.trim() });
          // 캐시/토큰 정리 및 라우팅
          await queryClient.cancelQueries();
          logout();
          queryClient.removeQueries();
          showAlert("성공적으로 탈퇴 처리되었어요.", () => {
            router.replace("/");
            router.dismissAll();
          });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ??
            "탈퇴에 실패했어요. 다시 시도해 주세요.";
          showAlert(msg);
        } finally {
          setLoading(false);
        }
      }
    );
  }, [
    canSubmit,
    reason,
    showActionAlert,
    queryClient,
    logout,
    showAlert,
    router,
  ]);

  return (
    <View style={styles.wrap}>
      <View style={styles.formWrap}>
        <View style={[styles.section, styles.sectionWarning]}>
          <AppText style={[styles.title, styles.titleDanger]}>
            계정 삭제 전 꼭 확인해 주세요
          </AppText>
          <View style={styles.bullets}>
            <AppText style={[styles.bullet, styles.bulletDanger]}>
              - 모든 데이터가 영구적으로 삭제됩니다.
            </AppText>
            <AppText style={[styles.bullet, styles.bulletDanger]}>
              - 삭제 후 복구가 불가합니다.
            </AppText>
            <AppText style={[styles.bullet, styles.bulletDanger]}>
              - 진행 중인 대화/기록도 삭제됩니다.
            </AppText>
          </View>
        </View>

        <View style={[styles.section, styles.sectionForm]}>
          <AppText style={styles.label}>삭제 사유</AppText>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="사유를 입력해 주세요"
            placeholderTextColor="#9CA3AF"
            multiline
            style={styles.input}
            maxLength={200}
          />
          <View style={styles.quickWrap}>
            {quickReasons.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => onPickQuick(r)}
                activeOpacity={0.7}
                style={styles.chip}
              >
                <AppText style={styles.chipText}>{r}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <Button
        label="삭제하기"
        onPress={onSubmit}
        disabled={!canSubmit}
        loading={loading}
        color="#FF6B3E"
        textColor="#fff"
      />
    </View>
  );
};

export default DeleteAccountForm;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 16,
    gap: 24,
    justifyContent: "space-between",
  },
  formWrap: {
    gap: 24,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  // 경고 섹션: 부드러운 핑크 틴트로 강조
  sectionWarning: {
    backgroundColor: "#FFF1F2", // rose-50
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FECACA", // rose-200
  },
  sectionForm: {
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  titleDanger: {
    color: "#B91C1C", // red-700
  },
  bullets: {
    gap: 6,
  },
  bullet: {
    color: "#6B7280",
  },
  bulletDanger: {
    color: "#B91C1C",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  quickWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
  },
  chipText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "bold",
  },
});
