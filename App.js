import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";

// Simple AR Scene
const InitialARScene = () => {
  const ViroARScene = require("@reactvision/react-viro").ViroARScene;
  const ViroText = require("@reactvision/react-viro").ViroText;
  const ViroConstants = require("@reactvision/react-viro").ViroConstants;

  const [text, setText] = React.useState("Initializing AR...");

  const onInitialized = (state, reason) => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText("Hello from Viro AR!");
    } else if (state === ViroConstants.TRACKING_NONE) {
      setText("Tracking lost...");
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={{
          fontFamily: "Arial",
          fontSize: 30,
          color: "#fff",
          textAlign: "center",
        }}
      />
    </ViroARScene>
  );
};

export default function App() {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: InitialARScene }}
        style={styles.flex}
      />
    );
  }
  // Fallback for web or unsupported platforms
  return (
    <View style={styles.center}>
      <Text>Viro AR is only supported on iOS/Android devices.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
