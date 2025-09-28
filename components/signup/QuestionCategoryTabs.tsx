import React from "react";
import { ScrollView, Pressable, View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";

type Category = {
  id: string;
  label: string;
};

interface Props {
  categories: Category[];
  selectedId: string;
  onChange: (categoryId: string) => void;
}

// 한글 주석: 카테고리 칩 형태의 가로 스크롤 탭 컴포넌트
const QuestionCategoryTabs = ({ categories, selectedId, onChange }: Props) => {
  return (
    <View style={s.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {categories.map((c) => {
          const selected = c.id === selectedId;
          return (
            <Pressable
              key={c.id}
              onPress={() => onChange(c.id)}
              style={({ pressed }) => [
                s.chip,
                selected ? s.chipSelected : s.chipDefault,
                pressed && s.chipPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={c.label}
            >
              <AppText style={[s.chipText, selected && s.chipTextSelected]}>
                {c.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default QuestionCategoryTabs;

const COLORS = {
  bg: "#FFFFFF",
  text: "#fff", // gray-900
  sub: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  fill: "#ff6b6b", // gray-100
  primary: "#FF7D4A",
};

const s = StyleSheet.create({
  root: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipDefault: {
    backgroundColor: COLORS.bg,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.fill,
    borderColor: COLORS.primary,
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipText: {
    color: COLORS.sub,
    fontSize: 13,
    fontWeight: "bold",
  },
  chipTextSelected: {
    color: COLORS.text,
  },
});
