import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/utils/api/profilePageApi";
import AppText from "@/components/common/AppText";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getMyProfileKey"],
    queryFn: () => getMyProfile(),
    staleTime: 1000 * 30,
  });

  //프로필 조회
  const profile = useMemo(() => data, [data]);

  return <ScrollView contentContainerStyle={styles.scroll}></ScrollView>;
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scroll: {
    paddingBottom: 60,
  },
  placeholder: { padding: 24 },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
