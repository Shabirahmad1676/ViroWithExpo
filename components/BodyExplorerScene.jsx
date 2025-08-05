import React, { useState } from "react";
import {
  ViroARScene,
  Viro3DObject,
  ViroImage,
  ViroText,
  ViroAmbientLight,
} from "@reactvision/react-viro";

const organs = {
  heart: {
    image: require("../assets/heart_texture.jpg"),
    description: "The heart pumps blood throughout the body.",
    scale: [1, 1, 1],
  },
  brain: {
    image: require("../assets/brain.png"),
    description: "The brain controls thoughts, memory, and movement.",
    scale: [1, 1, 1],
  },
  lungs: {
    image: require("../assets/lungs.jpg"),
    description: "Lungs help you breathe by taking in oxygen.",
    scale: [1, 1, 1],
  },
};


const BodyExplorerScene = () => {
  const [selected, setSelected] = useState("brain");
  const [showInfo, setShowInfo] = useState(false);

  const { image, description, scale } = organs[selected];


  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />

      {/* Organ Buttons */}
      <ViroText
        text="Heart"
        position={[0, 0, -1]}
        onClick={() => { setSelected("heart"); setShowInfo(false); }}
        style={{ fontSize: 20, color: "red" }}
      />
      <ViroText
        text="Brain"
        position={[0, 0.4, -2]}
        onClick={() => { setSelected("brain"); setShowInfo(false); }}
        style={{ fontSize: 20, color: "purple" }}
      />
      <ViroText
        text="Lungs"
        position={[0.8, 0.4, -3]}
        onClick={() => { setSelected("lungs"); setShowInfo(false); }}
        style={{ fontSize: 20, color: "blue" }}
      />

      <ViroImage
  source={image}
  position={[0, -0.3, -3.2]}
  scale={scale}
  onClick={() => setShowInfo(!showInfo)}
  dragType="FixedToWorld"
  onDrag={() => console.log("Dragging")}
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
