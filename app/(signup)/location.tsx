import ScreenWithStickyAction from "@/components/common/ScreenWithStickyAction";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSignupDraftStore } from "@/utils/store/useSignupDraftStore";
import LocationSheet from "@/components/signup/LocationSheet";
import AppText from "@/components/common/AppText";
import SignupHeader from "@/components/signup/SignupHeader";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ScalePressable from "@/components/common/ScalePressable";

const LocationPage = () => {
  const router = useRouter();
  const location = useSignupDraftStore((s) => s.draft.location);
  const nickname = useSignupDraftStore((s) => s.draft.nickname);
  const patch = useSignupDraftStore((s) => s.patch);
  const sheetRef = useRef<BottomSheetModal>(null);

  return (
    <ScreenWithStickyAction
      action={
        <Button
          label="계속하기"
          color="#FF7D4A"
          textColor="#fff"
          disabled={!location}
          style={styles.button}
          onPress={() => router.push("/(signup)/question")}
        />
      }
    >
      <View style={styles.container}>
        <SignupHeader
          title={`${nickname}님,\n어느 동네에 살고 계신가요?`}
          subtitle={`정확한 위치는 공개되지 않아요!\n\n가까이 있는 인연을 찾는 데 도움을 드릴게요.`}
        />
        <ScalePressable
          style={[styles.locationBox, location && styles.locationBoxFocused]}
          onPress={() => sheetRef.current?.present?.()}
        >
          <Ionicons
            name="map-outline"
            size={24}
            color={location ? "#5C4B44" : "#B0A6A0"}
          />
          <AppText
            style={[
              styles.locationText,
              location && styles.locationTextFocused,
            ]}
          >
            {location || "지역 선택하기"}
          </AppText>
        </ScalePressable>
      </View>
      <LocationSheet
        ref={sheetRef}
        snapPoints={["90%"]}
        onSelect={(code, name) => {
          patch({ location: name });
        }}
      />
    </ScreenWithStickyAction>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 32,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B0A6A0",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 55,
    paddingHorizontal: 10,
    gap: 8,
  },
  locationText: {
    color: "#B0A6A0",
  },
  locationBoxFocused: {
    borderColor: "#d9d9d9",
  },
  locationTextFocused: {
    color: "#5C4B44",
  },
});
