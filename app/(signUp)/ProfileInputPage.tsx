import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/common/Button";

const ProfileInputPage = () => {
  const [birth, setBirth] = useState("");
  const isValid = birth.length === 6;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>생년월일을 입력해 주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="YYMMDD"
        keyboardType="number-pad"
        value={birth}
        onChangeText={setBirth}
        maxLength={6}
      />
      <View style={{ marginTop: "auto" }}>
        <Button
          label="계속하기"
          color="#FF6F3C"
          textColor="#fff"
          disabled={!isValid}
          onPress={() => Alert.alert("끝!")}
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default ProfileInputPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    marginTop: 32,
  },
});
