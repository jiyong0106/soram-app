import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppHeader from "@/components/common/AppHeader";
import { ProfileType } from "@/utils/types/profile";

// 더미
const mockOtherProfile: ProfileType = {
  nickname: "달빛 산책자",
  gender: "FEMALE",
  birthdate: "1997-02-14",
  location: "바람의 언덕",
  answers: [
    {
      questionId: 1,
      content: "하루의 끝에 가장 좋아하는 건, 노을빛 아래 산책이에요.",
      isPrimary: true,
    },
  ],
};

const OtherProfilePage = () => {
  const params = useLocalSearchParams();
  const id = params.id as string;
  // id를 사용해 데이터 패칭 예정

  return (
    <View style={styles.container}>
      <AppHeader />
    </View>
  );
};

export default OtherProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
