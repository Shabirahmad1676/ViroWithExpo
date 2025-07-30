import { StyleSheet } from "react-native";

import { ViroARScene, ViroText } from "@reactvision/react-viro";

export function HelloWave() {
  return (
    <ViroARScene>
      <ViroText
        text="Bircube"
        position={[0, -0.1, -1]}
        style={styles.text}
      />
    </ViroARScene>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
    textTransform: "uppercase",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 0 },
  },
});
