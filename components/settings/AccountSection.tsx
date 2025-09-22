import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";
import { postLogout } from "@/utils/api/profilePageApi";
import useAlert from "@/utils/hooks/useAlert";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const AccountSection = () => {
  const { showAlert, showActionAlert } = useAlert();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    showActionAlert("로그아웃 하시겠습니까?", "확인", async () => {
      if (loading) return;
      setLoading(true);
      try {
        await queryClient.cancelQueries();
        await postLogout(); // 서버 refresh 쿠키 무효화
      } catch (e: any) {
        if (e) showAlert(e.response.data.message);
        setLoading(false);
        return;
      } finally {
        logout(); // 토큰 메모리/헤더/스토어 정리
        queryClient.removeQueries(); // 캐시 제거
        router.replace("/");
        router.dismissAll();
        setLoading(false);
      }
    });
  };

  const handleDeleteAccount = () => {
    router.push("/profile/setting/deleteAccount");
  };

  return (
    <SettingSection title="계정">
      <SettingRow
        title="로그아웃"
        variant="danger"
        onPress={handleLogout}
        disabled={loading}
      />
      <SettingRow
        title="계정 삭제"
        variant="danger"
        onPress={handleDeleteAccount}
      />
    </SettingSection>
  );
};

export default AccountSection;
