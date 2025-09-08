import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const width = Dimensions.get("window").width;
const CARD_W = Math.min(260, width * 0.72);
const CARD_H = 180;

type PhotoCarouselProps = { images?: string[] };

const PhotoCarousel = ({ images = [] }: PhotoCarouselProps) => {
  if (images.length === 0) {
    // 플레이스홀더
    images = [
      "https://picsum.photos/600/400?1",
      "https://picsum.photos/600/400?2",
      "https://picsum.photos/600/400?3",
    ];
  }

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.card} />
        ))}
      </ScrollView>
      <Text style={styles.caption}>사진으로 전하는 하루의 분위기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8, gap: 8 },
  card: {
    width: CARD_W,
    height: CARD_H,
    marginLeft: 16,
    borderRadius: 16,
    backgroundColor: "#eee",
  },
  caption: { marginLeft: 16, fontSize: 12, color: "#777" },
});

export default PhotoCarousel;
