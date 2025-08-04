import React from "react";
import {
  ViroARScene,
  ViroARImageMarker,
  Viro3DObject,
  ViroAmbientLight,
  ViroARTrackingTargets,
  ViroAnimations,
  ViroText
} from "@reactvision/react-viro";


// Register the target (can be moved to a separate file)
ViroARTrackingTargets.createTargets({
  "logoMarker": {
    source: require("../assets/markers/marker.jpg"),
    orientation: "Up",
    physicalWidth: 0.1,
  },
});

ViroAnimations.registerAnimations({
  loopRotate: {
    properties: {
      rotateY: "+=45",
      // rotateX: "+=90",
    },
    duration: 1000,
  },
});

export default function MarkerScene() {
   const openURL = () => {
    Linking.openURL("https://yourwebsite.com");
  };

  return (
    <ViroARScene>
       <ViroAmbientLight color="#FFFFFF" />
      <ViroARImageMarker
        target={"logoMarker"}
        onAnchorFound={() => console.log("🎯 Marker detected!")}
      >
        {/* <Viro3DObject
        animation={{ name: "loopRotate", run: true, loop: true }}
           source={require("../assets/heart.glb")}
          position={[0, 0, -1]}
          scale={[0.02, 0.02, 0.02]}
          type="GLB"
        /> */}

          <ViroText
          text="🔗 Visit Website"
          position={[0, 0, -2]}
          scale={[0.3, 0.3, 0.3]}
          style={{ fontSize: 20, color: "#00f", fontWeight: "bold" }}
          onClick={openURL}
          // width={2}
          // height={2}
        />
      </ViroARImageMarker>
    </ViroARScene>
  );
}

