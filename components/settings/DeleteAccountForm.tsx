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
      <View style={styles.section}>
        <AppText style={styles.title}>계정 삭제 전 꼭 확인해 주세요</AppText>
        <View style={styles.bullets}>
          <AppText style={styles.bullet}>
            - 모든 데이터가 영구적으로 삭제됩니다.
          </AppText>
          <AppText style={styles.bullet}>- 삭제 후 복구가 불가합니다.</AppText>
          <AppText style={styles.bullet}>
            - 진행 중인 대화/기록도 삭제됩니다.
          </AppText>
        </View>
      </View>

      <View style={styles.section}>
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

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.deleteBtn, !canSubmit && styles.deleteBtnDisabled]}
        >
          <AppText style={styles.deleteText}>
            {loading ? "삭제 중…" : "계정 영구 삭제"}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.cancelBtn}
        >
          <AppText style={styles.cancelText}>취소</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteAccountForm;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  bullets: {
    gap: 6,
  },
  bullet: {
    color: "#6B7280",
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
  footer: {
    gap: 12,
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  deleteBtnDisabled: {
    opacity: 0.6,
  },
  deleteText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "bold",
  },
});
