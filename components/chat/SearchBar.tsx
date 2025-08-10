import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "검색",
}: SearchBarProps) {
  return (
    <View style={styles.searchWrap}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9AA0A6"
      />
      <Ionicons
        name="search"
        size={20}
        color="#222"
        style={styles.searchIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#DADCE0",
    paddingLeft: 16,
    paddingRight: 40,
    justifyContent: "center",
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
  },
  searchIcon: {
    position: "absolute",
    right: 12,
  },
});
