// import React from "react";
// import { View, StyleSheet } from "react-native";
// import SettingSection from "@/components/settings/SettingSection";
// import SettingRow from "@/components/settings/SettingRow";
// import useAlert from "@/utils/hooks/useAlert";
// import { useRouter } from "expo-router";

// const ActivitySection = () => {
//   const { showAlert } = useAlert();
//   const router = useRouter();

//   const handleMyAnswers = () => {
//     router.push("/profile/setting/myResponses");
//   };

//   const handlePastStories = () => {
//     // TODO: 지난 이야기들 보기 페이지로 이동하는 로직 구현
//     // 가이드라인에 명시된 'GET /users/me/unlocked-responses' API를 활용할 수 있습니다.
//     showAlert("지난 이야기들 보기 페이지로 이동합니다.");
//   };

//   const handleBolcked = () => {
//     router.push("/profile/setting/blocked");
//   };

//   return (
//     <SettingSection title="활동">
//       <SettingRow
//         title="내가 남긴 이야기들"
//         onPress={handleMyAnswers}
//         variant="link"
//       />
//       <SettingRow
//         title="지난 이야기들 보기"
//         onPress={handlePastStories}
//         variant="link"
//       />
//       <SettingRow title="차단 목록" onPress={handleBolcked} variant="link" />
//       <View style={styles.divider} />
//     </SettingSection>
//   );
// };

// export default ActivitySection;

// const styles = StyleSheet.create({
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: "#5C4B44",
//     marginTop: 8,
//     marginBottom: 8,
//   },
// });
