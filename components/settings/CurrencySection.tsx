import React from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";
import useAlert from "@/utils/hooks/useAlert";

const CurrencySection = () => {
  const { showAlert } = useAlert();

  // TODO: 실제 사용자 재화 정보를 API로 조회하여 연동해야 합니다.
  const chatTickets = 10;
  const viewTickets = 3;

  const handleHistory = () => {
    // TODO: 재화 사용내역 페이지로 이동하는 로직 구현
    showAlert("재화 사용내역 페이지로 이동합니다.");
  };

  return (
    <SettingSection title="보유 재화">
      <SettingRow
        title="대화 요청권"
        rightText={`${chatTickets}개`} // 👈 보유량을 rightText로 표시
      />
      <SettingRow
        title="이야기 보기권"
        rightText={`${viewTickets}개`} // 👈 보유량을 rightText로 표시
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
