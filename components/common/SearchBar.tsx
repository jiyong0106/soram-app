import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  // value가 주어지면 제어형으로 동작, 없으면 로컬 상태로 동작
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  value,
  defaultValue = "",
  onChangeText,
  placeholder = "검색",
}: SearchBarProps) => {
  const [focused, setFocused] = useState(false);
  const [innerText, setInnerText] = useState<string>(value ?? defaultValue);

  // 제어형으로 사용 시 외부 value 변화에 동기화
  useEffect(() => {
    if (value !== undefined) {
      setInnerText(value);
    }
  }, [value]);

  const displayValue = value !== undefined ? value : innerText;

  return (
    <View style={[styles.container, focused && styles.searchWrapFocused]}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={displayValue}
        onChangeText={(t) => {
          setInnerText(t); // 로컬 상태 업데이트
          onChangeText?.(t); // 부모에 변경 사항 통지
        }}
        placeholderTextColor="#B0A6A0"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <TouchableOpacity
          onPress={() => {
            setInnerText("");
            onChangeText?.("");
          }}
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
