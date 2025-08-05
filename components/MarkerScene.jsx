import React, { useState } from "react";
import {
  ViroARScene,
  ViroARImageMarker,
  Viro3DObject,
  ViroAmbientLight,
  ViroARTrackingTargets,
  ViroAnimations,
  ViroText
} from "@reactvision/react-viro";
import { Linking } from "react-native";


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

     const [markerVisible, setMarkerVisible] = useState(false);


   const openURL = () => {
    Linking.openURL("https://yourwebsite.com");
  };

  const contactOnWhatsApp = () => {
  const phone = "1234567890"; // Your number (with country code, e.g. +91)
  const message = "Hello! I'm interested in your services.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
};


  return (
    <ViroARScene>
       <ViroAmbientLight color="#FFFFFF" intensity={200} temperature={300} />
      <ViroARImageMarker
        target={"logoMarker"}
         onAnchorFound={() => {
          console.log("🎯 Marker detected!");
          setMarkerVisible(true);
        }}
        onAnchorRemoved={() => {
          console.log("❌ Marker lost");
          setMarkerVisible(false);
        }}
      >
        {/* <Viro3DObject
        animation={{ name: "loopRotate", run: true, loop: true }}
           source={require("../assets/heart.glb")}
          position={[0, 0, -1]}
          scale={[0.02, 0.02, 0.02]}
          type="GLB"
        /> */}

        {markerVisible && (
            <>
              <ViroText
          text="🔗 Visit Website"
          position={[0, 0, -2]}
          scale={[0.3, 0.3, 0.3]}
          style={{ fontSize: 20, color: "#00f", fontWeight: "bold" }}
          onClick={openURL}
          // width={2}
          // height={2}
        />

        <ViroText
  text="💬 Contact on WhatsApp"
  position={[0, -0.3, -0.5]}  // Adjust based on layout
  scale={[0.2, 0.2, 0.2]}
  style={{
    fontSize: 18,
    color: "#25D366", // WhatsApp green
    fontWeight: "bold",
    textAlign: "center",
  }}
  onClick={contactOnWhatsApp}
/>
            </>
        )}
      </ViroARImageMarker>
    </ViroARScene>
  );
}