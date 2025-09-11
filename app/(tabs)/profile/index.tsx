import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ProfileType } from "@/utils/types/profile";
import ProfileHero from "@/components/profile/ProfileHero";
import PhotoCarousel from "@/components/profile/PhotoCarousel";
import AnswerList from "@/components/profile/AnswerList";
import Divider from "@/components/profile/Divider";
import CTASection from "@/components/profile/CTASection";
import PageContainer from "@/components/common/PageContainer";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignupTokenStore } from "@/utils/store/useSignupTokenStore";
import { useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/utils/store/useAuthStore";
import ScalePressable from "@/components/common/ScalePressable";

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

  const signupToken = useSignupTokenStore((s) => s.signupToken);
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  // 초기화: SecureStore + zustand 동시 정리
  const handleClearAll = async () => {
    // 1) 진행 중인 쿼리 취소
    await queryClient.cancelQueries();

    // 2) 토큰 정리 (메모리/헤더 + persist 삭제)
    logout();
    await SecureStore.deleteItemAsync("auth-store");

    clearSignupToken();

    // 3) React Query 캐시 초기화
    queryClient.removeQueries();

    router.replace("/");
  };
  console.log(token); 

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <ScalePressable
              style={{ paddingHorizontal: 16, marginLeft: "auto" }}
              onPress={() => router.push("/profile/setting")}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </ScalePressable>
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
          <View style={styles.checkToken}>
            <Text style={styles.label}>signupToken (메모리):</Text>
            <Text style={styles.value}>{signupToken ?? "없음"}</Text>

            <Text style={styles.label}>accessToken (store):</Text>
            <Text style={styles.value}>{token ?? "없음"}</Text>

            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.btn}
              activeOpacity={0.7}
            >
              <Text style={styles.btnText}>모든 토큰 초기화 후 홈 이동</Text>
            </TouchableOpacity>
          </View>
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
  label: {
    marginTop: 8,
    color: "#666",
  },
  value: {
    color: "#222",
  },
  btn: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#ff6b6b",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  checkToken: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
  },
});
