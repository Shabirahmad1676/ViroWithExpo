import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
const BillBoardCard = ({
  title,
  description,
  image,
  price,
  category,
  imgLoading,
  imgError,
  setImgLoading,
  setImgError,
}) => {
  return (
    <View>
      <View style={styles.card}>
        {image ? (
          <View style={styles.imageWrap}>
            {imgLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="small" />
              </View>
            )}
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setImgLoading(false)}
              onError={() => {
                setImgLoading(false);
                setImgError(true);
              }}
            />
            {imgError && (
              <View style={styles.imgErrorOverlay}>
                <Text style={styles.imgErrorText}>Image failed to load</Text>
              </View>
            )}
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>
        {category ? (
          <Text style={styles.meta}>Category: {category}</Text>
        ) : null}
        {price ? <Text style={styles.price}>Price: {price}</Text> : null}
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
};

export default BillBoardCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  imageLoader: {
    position: "absolute",
    zIndex: 2,
  },
  imgErrorOverlay: {
    position: "absolute",
    zIndex: 3,
    backgroundColor: "rgba(0,0,0,0.45)",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  imgErrorText: { color: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
    textAlign: "center",
  },
  meta: { fontSize: 13, color: "#666", marginBottom: 6 },
  price: { fontSize: 18, color: "#111", fontWeight: "600", marginBottom: 8 },
  desc: { fontSize: 16, color: "#444", textAlign: "center", lineHeight: 22 },
});
