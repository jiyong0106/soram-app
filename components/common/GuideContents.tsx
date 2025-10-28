import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { Image } from "expo-image";
import { guideOptions } from "@/utils/util/options";

const GuideContents = () => {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={guideOptions}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const w = e.nativeEvent.layoutMeasurement.width;
          const x = e.nativeEvent.contentOffset.x;
          const next = Math.round(x / w);
          if (next !== index) setIndex(next);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              contentFit="contain"
            />
            <AppText style={styles.title}>{item.title}</AppText>
            {item.description ? (
              <AppText style={styles.desc}>{item.description}</AppText>
            ) : null}
          </View>
        )}
      />

      <View style={styles.dots}>
        {guideOptions.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index ? styles.dotActive : undefined]}
          />
        ))}
      </View>
    </View>
  );
};

export default GuideContents;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  slide: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 12,
  },
  image: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#2b2b2b",
  },
  desc: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b6b6b",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d9d9d9",
  },
  dotActive: {
    backgroundColor: "#5C4B44",
  },
});
