// GuideContents.tsx
import React, { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import AppText from "./AppText";
import { Image } from "expo-image";
import { guideOptions } from "@/utils/util/options";

interface Porps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const GuideContents = ({ activeIndex, setActiveIndex }: Porps) => {
  const listRef = useRef<FlatList<(typeof guideOptions)[number]>>(null);
  const [itemWidth, setItemWidth] = useState<number>(
    Dimensions.get("window").width * 0.9
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / itemWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        setItemWidth(w);
      }}
    >
      <FlatList
        ref={listRef}
        data={guideOptions}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={itemWidth}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        disableIntervalMomentum={true}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: itemWidth }]}>
            <View style={styles.imageArea}>
              <Image
                source={item.image}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <AppText style={styles.title}>{item.title}</AppText>
            <AppText style={styles.desc}>{item.description}</AppText>
          </View>
        )}
      />
    </View>
  );
};

export default GuideContents;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slide: {
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 20,
    backgroundColor: "transparent",
    height: "auto",
  },
  imageArea: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
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
    lineHeight: 23,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d9d9d9",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#5C4B44",
  },
});
