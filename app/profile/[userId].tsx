import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/utils/api/profilePageApi";
import AppText from "@/components/common/AppText";
import ProfileBranding from "@/components/profile/ProfileBranding";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAnswers from "@/components/profile/ProfileAnswers";
import ProfileInterests from "@/components/profile/ProfileInterests";
import { Stack, useLocalSearchParams } from "expo-router";
import { BackButton } from "@/components/common/backbutton";
import { SafeAreaView } from "react-native-safe-area-context";

const UserProfilePage = () => {
  const { userId, nickname } = useLocalSearchParams<{
    userId: string;
    nickname: string;
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["getUserProfileKey", userId],
    queryFn: () => getUserProfile(Number(userId)),
    staleTime: 1000 * 30,
  });

  const profile = useMemo(() => data, [data]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: `${nickname}님의 프로필`,
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading || !profile ? (
          <View style={styles.placeholder}>
            <AppText>{nickname}님의 프로필을 불러오고 있어요…</AppText>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <ProfileBranding />
            <ProfileHeader profile={profile} />
            <ProfileAnswers answers={profile.answers} />
            <ProfileInterests interests={profile.interests} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfilePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
  },
  profileCard: { marginBottom: 24, padding: 20 },
  placeholder: { padding: 24, flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
