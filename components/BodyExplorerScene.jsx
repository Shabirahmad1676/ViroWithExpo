import React, { useState } from "react";
import {
  ViroARScene,
  Viro3DObject,
  ViroText,
  ViroAmbientLight,
} from "@reactvision/react-viro";

const organs = {
  heart: {
    model: require("../assets/heart.glb"),
    description: "The heart pumps blood throughout the body.",
    scale: [0.3, 0.3, 0.3],
  },
  brain: {
    model: require("../assets/brain.glb"),
    description: "The brain controls thoughts, memory, and movement.",
    scale: [0.2, 0.2, 0.2],
  },
  lungs: {
    model: require("../assets/lungs.glb"),
    description: "Lungs help you breathe by taking in oxygen.",
    scale: [0.5, 0.5, 0.5],
  },
};

const BodyExplorerScene = () => {
  const [selected, setSelected] = useState("heart");
  const [showInfo, setShowInfo] = useState(false);

  const { model, description, scale } = organs[selected];

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />

      {/* Organ Buttons */}
      <ViroText
        text="Heart"
        position={[-0.5, 0.4, -2]}
        onClick={() => { setSelected("heart"); setShowInfo(false); }}
        style={{ fontSize: 20, color: "red" }}
      />
      <ViroText
        text="Brain"
        position={[0, 0.4, -4]}
        onClick={() => { setSelected("brain"); setShowInfo(false); }}
        style={{ fontSize: 20, color: "purple" }}
      />
      <ViroText
        text="Lungs"
        position={[0.8, 0.4, -3]}
        onClick={() => { setSelected("lungs"); setShowInfo(false); }}
        style={{ fontSize: 20, color: "blue" }}
      />

      {/* Active 3D Organ */}
      <Viro3DObject
        source={model}
        type="GLB"
        position={[0, -0.3, -3]}
        scale={scale}
        onClick={() => setShowInfo(!showInfo)}
        dragType="FixedToWorld"
        onDrag={() => console.log("Dragging")}
        onPinch={(pinchState, scaleFactor, source) => {
          if (pinchState === 3) console.log("Pinch complete:", scaleFactor);
        }}
      />

      {/* Info Text */}
      {showInfo && (
        <ViroText
          text={description}
          position={[0, 4, -2]}
          width={2}
          height={2}
          style={{ fontSize: 16, color: "black" }}
        />
      )}
    </ViroARScene>
  );
};

export default BodyExplorerScene;
