import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroMaterials,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARPlaneSelector,
  ViroNode,
  ViroAnimations,
} from "@reactvision/react-viro";

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");

  const handleTrackingInitialized = useCallback(() => {
    setText("Hello World!");
  }, []);

  return (
    <ViroARScene onTrackingUpdated={handleTrackingInitialized}>
      <ViroText
        text={text}
        scale={[0.1, 0.1, 0.1]}
        height={1}
        width={4}
        position={[0, 0.5, -1]}
        style={styles.helloWorldTextStyle}
      />

      <ViroAmbientLight color="#aaaaaa" />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#ffffff"
        castsShadow={true}
      />

      <Viro3DObject
        source={require('../assets/models/emoji.jpg')}
        position={[0, 0, -1]}
        scale={[0.2, 0.2, 0.2]}
        type="VRX"
        dragType="FixedDistance"
        onDrag={() => {}}
      />
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 50,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

export default HelloWorldSceneAR;
