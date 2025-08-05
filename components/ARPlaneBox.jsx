// ARPlaneBox.js
import React from "react";
import {
  ViroARScene,
  ViroBox,
  ViroMaterials,
  ViroARPlane,
} from "@reactvision/react-viro";
import { Linking } from "react-native";

ViroMaterials.createMaterials({
  boxMaterial: {
    diffuseColor: "#FF69B4", // Hot pink box
  },
});

export default function ARPlaneBox() {
   const openURL = () => {
     console.log("🟣 Box clicked!");
      Linking.openURL("https://youtube.com");
    };
  return (
    <ViroARScene
      anchorDetectionTypes="PlanesHorizontal"
      onTrackingUpdated={(state, reason) => {
        console.log("Tracking state:", state, "Reason:", reason);
      }}
    >
      <ViroARPlane
        minHeight={0.5}
        minWidth={0.4} //in meter
        alignment="Horizontal"  //vertical for walls
        onAnchorFound={() => console.log("✅ Plane Found")}
        onAnchorRemoved={() => console.log("❌ Plane Removed")}
      >
        <ViroBox
          position={[0, 0.05, 0]}
          scale={[0.1, 0.1, 0.1]}
          materials={["boxMaterial"]}
          onClick={openURL}
        />
        
      </ViroARPlane>
    </ViroARScene>
  );
}
