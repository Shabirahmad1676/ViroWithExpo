import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BusinessCardARScene from "@/components/BusinessCardARScene";

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

import {
  ViroARSceneNavigator,
  ViroScene,
  ViroText,
} from "@reactvision/react-viro";

export default function HomeScreen() {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (
      <>
        <ViroARSceneNavigator
          autofocus={true}
          // initialScene={{ scene: BusinessCardARScene }}
          initialScene={{ scene: HelloWave }}
          style={styles.flex}
        />
      </>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 20, marginBottom: 20, color: "red" }}>
        AR is only supported on iOS/Android devices.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
