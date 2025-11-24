import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "검색",
}: SearchBarProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.container, focused && styles.searchWrapFocused]}>
      <TextInput
        style={styles.searchInput}
        placeholder="검색"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#B0A6A0"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={18} color="#B0A6A0" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B0A6A0",
  },
  searchInput: {
    fontSize: 14,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 40,
    paddingVertical: 12, //높이 조절 패딩
  },
  searchWrapFocused: {
    borderColor: "#FF6B3E",
  },
  clearButton: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
