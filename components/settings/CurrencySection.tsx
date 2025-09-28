import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import SettingSection from "@/components/settings/SettingSection";
import SettingRow from "@/components/settings/SettingRow";
import { useRouter } from "expo-router";
import TicketsSheet from "@/components/topic/TicketsSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const CurrencySection = () => {
  const router = useRouter();
  // 바텀시트를 제어하기 위한 ref 생성
  const ticketsSheetRef = useRef<BottomSheetModal>(null);
  const handleHistory = () => {
    // 재화 사용내역 페이지로 이동
    router.push("/profile/setting/ticketHistory");
  };
  const handleOwnedTickets = () => {
    // 바텀시트를 띄우는 코드로 변경.
    ticketsSheetRef.current?.present();
  };

  return (
    // <SettingSection>을 <View>로 감싸고, TicketsSheet를 추가
    <View>
      <SettingSection title="보유 재화">
        <SettingRow
          title="현재 보유중인 사용권"
          onPress={handleOwnedTickets}
          variant="link"
        />
        <SettingRow title="사용내역" onPress={handleHistory} variant="link" />
        <View style={styles.divider} />
      </SettingSection>

      {/* 렌더링될 TicketsSheet 컴포넌트를 추가하고 ref를 연결 */}
      <TicketsSheet ref={ticketsSheetRef} snapPoints={["50%"]} />
    </View>
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
