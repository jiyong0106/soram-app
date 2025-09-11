import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ProfileType } from "@/utils/types/profile";
import ProfileHero from "@/components/profile/ProfileHero";
import PhotoCarousel from "@/components/profile/PhotoCarousel";
import AnswerList from "@/components/profile/AnswerList";
import Divider from "@/components/profile/Divider";
import CTASection from "@/components/profile/CTASection";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const mockUser: ProfileType = {
  nickname: "하루",
  gender: "FEMALE",
  birthdate: "1998-03-12",
  location: "바람의 언덕",
  answers: [
    {
      questionId: 1,
      content: "작은 것에 행복을 느끼는 편. 오늘의 작은 기쁨을 기록해요.",
      isPrimary: true,
    },
    { questionId: 2, content: "비 내리는 날의 카페, 어쿠스틱 음악." },
  ],
};

const ProfilePage = () => {
  const profile = mockUser;

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ paddingHorizontal: 16 }}>
              <Ionicons name="ellipsis-vertical" size={22} />
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHero profile={profile} />
          <PhotoCarousel />
          <Divider />
          <AnswerList profile={profile} />
          <CTASection
            isOwnProfile={true}
            onPressPrimary={() => {}}
            onPressSecondary={() => {}}
          />
        </ScrollView>
      </View>
    </PageContainer>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: { paddingBottom: 24 },
});
