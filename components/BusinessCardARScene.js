import React, { useState, useCallback } from "react";
import { StyleSheet, Alert, Platform, View, Text } from "react-native";
import {
  ViroARScene,
  ViroDirectionalLight,
  ViroBox,
  ViroARTrackingTargets,
  ViroMaterials,
  ViroText,
  ViroImage,
  ViroFlexView,
  ViroARImageMarker,
  ViroARObjectMarker,
  ViroAmbientLight,
  ViroARPlane,
  ViroAnimatedImage,
  ViroAnimations,
  ViroNode,
  Viro3DObject,
  ViroQuad
} from "@reactvision/react-viro";

// Dynamically require ViroConstants only on supported platforms
const ViroConstants =
  Platform.OS === "ios" || Platform.OS === "android"
    ? require("@reactvision/react-viro").ViroConstants
    : undefined;

// Register AR Tracking Targets, Materials, and Animations (should only be done once)
if (Platform.OS === "ios" || Platform.OS === "android") {
  ViroARTrackingTargets.createTargets({
    businessCard: {
      source: require("../assets/business_card.png"),
      orientation: "Up",
      physicalWidth: 0.05, // real world width in meters
    },
  });

  ViroMaterials.createMaterials({
    imagePlaceholder: {
      diffuseColor: "rgba(255,255,255,1)",
    },
    quad: {
      diffuseColor: "rgba(0,0,0,0.5)",
    },
  });

  ViroAnimations.registerAnimations({
    animateImage: {
      properties: {
        positionX: 0.05,
        opacity: 1.0,
      },
      easing: "Bounce",
      duration: 500,
    },
    animateViro: {
      properties: {
        positionZ: 0.02,
        opacity: 1.0,
      },
      easing: "Bounce",
      duration: 500,
    },
  });
}

export default function BusinessCardARScene() {
  const [isTracking, setIsTracking] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);

  const onInitialized = useCallback((state, reason) => {
    if (!ViroConstants) return;
    if (state === ViroConstants.TRACKING_NORMAL) {
      setIsTracking(true);
      setInitialized(true);
    } else if (state === ViroConstants.TRACKING_NONE) {
      setIsTracking(false);
    }
  }, []);

  const getNoTrackingUI = () => (
    <ViroText
      text={initialized ? "Initializing AR..." : "No Tracking"}
      position={[0, 0, -1]}
      style={styles.textStyle}
    />
  );

  const getARScene = () => (
    <ViroNode>
      <ViroARImageMarker
        target={"businessCard"}
        onAnchorFound={() => setRunAnimation(true)}
      >
        <ViroNode key="card">
          <ViroNode
            opacity={0}
            position={[0, -0.02, 0]}
            animation={{ name: "animateImage", run: runAnimation }}
          >
            <ViroFlexView
              rotation={[-90, 0, 0]}
              height={0.03}
              width={0.05}
              style={styles.card}
            >
              <ViroFlexView style={styles.cardWrapper}>
                <ViroImage
                  height={0.015}
                  width={0.015}
                  style={styles.image}
                  source={require("../assets/avatar.png")}
                />
                <ViroText
                  textClipMode="None"
                  text="Vladimir Novick"
                  scale={[0.015, 0.015, 0.015]}
                  style={styles.textStyle}
                />
              </ViroFlexView>
              <ViroFlexView
                onTouch={() => Alert.alert("twitter")}
                style={styles.subText}
              >
                <ViroText
                  width={0.01}
                  height={0.01}
                  textAlign="left"
                  textClipMode="None"
                  text="@VladimirNovick"
                  scale={[0.01, 0.01, 0.01]}
                  style={styles.textStyle}
                />
                <ViroAnimatedImage
                  height={0.01}
                  width={0.01}
                  loop={true}
                  source={require("../assets/tweet.gif")}
                />
              </ViroFlexView>
            </ViroFlexView>
          </ViroNode>
          <ViroNode
            opacity={0}
            position={[0, 0, 0]}
            animation={{ name: "animateViro", run: runAnimation }}
          >
            <ViroText
              text="www.viromedia.com"
              rotation={[-90, 0, 0]}
              scale={[0.01, 0.01, 0.01]}
              style={styles.textStyle}
            />
          </ViroNode>
        </ViroNode>
      </ViroARImageMarker>
    </ViroNode>
  );

  if (!ViroConstants) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>AR is only supported on iOS/Android native builds.</Text>
      </View>
    );
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {isTracking ? getARScene() : getNoTrackingUI()}
    </ViroARScene>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    flex: 0.5,
    // fontFamily: "Roboto", // Temporarily removed to avoid iOS crash
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "top",
    textAlign: "left",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "column",
  },
  cardWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 0.001,
    flex: 0.5,
  },
  subText: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 0.5,
  },
  image: {},
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
