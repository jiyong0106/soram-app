import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSignupTokenStore } from "@/utils/sotre/useSignupTokenStore";

const ConnectPage = () => {
  const signupToken = useSignupTokenStore.getState().signupToken;
  const clearSignupToken = useSignupTokenStore((s) => s.clear);
  console.log("남아있는 signupToken===>", signupToken);
  const handlePress = () => {
    clearSignupToken();
  };

  return (
    <View>
      <Text>ConnectPage</Text>
      <View>
        <TouchableOpacity onPress={handlePress}>
          <Text>모든 토큰 초기화 후 돌아가기 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConnectPage;

const styles = StyleSheet.create({});
