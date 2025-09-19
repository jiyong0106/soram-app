import React from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";
import { useRouter } from "expo-router";

const CurrencySection = () => {
  const router = useRouter();

  const handleHistory = () => {
    // 재화 사용내역 페이지로 이동
    router.push("/profile/setting/ticketHistory");
  };
  const handleOwnedTickets = () => {
    // 재화 구매 페이지로 이동
    alert("재화 구매 페이지로 이동합니다.");
  };

  return (
    <SettingSection title="보유 재화">
      <SettingRow
        title="현재 보유중인 사용권"
        onPress={handleOwnedTickets}
        variant="link"
      />
      <SettingRow
        title="사용내역"
        onPress={handleHistory}
        variant="link" // 👈 페이지 이동이 필요하므로 링크 아이콘 추가
      />
      <View style={styles.divider} />
    </SettingSection>
  );
};

export default CurrencySection;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#5C4B44",
    marginTop: 8,
    marginBottom: 8,
  },
});
