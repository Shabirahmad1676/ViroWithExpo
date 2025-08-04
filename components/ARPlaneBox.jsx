// ARPlaneBox.js
import React from "react";
import {
  ViroARScene,
  ViroBox,
  ViroMaterials,
  ViroARPlane,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  boxMaterial: {
    diffuseColor: "#FF69B4", // Hot pink box
  },
});

export default function ARPlaneBox() {
  return (
    <ViroARScene
      anchorDetectionTypes="PlanesHorizontal"
      onTrackingUpdated={(state, reason) => {
        console.log("Tracking state:", state, "Reason:", reason);
      }}
    >
      <ViroARPlane
        minHeight={0.5}
        minWidth={0.4}
        alignment="Horizontal"
        onAnchorFound={() => console.log("✅ Plane Found")}
        onAnchorRemoved={() => console.log("❌ Plane Removed")}
      >
        <ViroBox
          position={[0, 0, -1]}
          scale={[0.1, 0.1, 0.1]}
          materials={["boxMaterial"]}
        />
      </ViroARPlane>
    </ViroARScene>
  );
}
