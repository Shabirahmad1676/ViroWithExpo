import React from 'react';
import { ViroARScene, ViroText } from '@reactvision/react-viro';

const HelloScene = () => (
  <ViroARScene>
    <ViroText
      text="Welcome To World Of AR"
      position={[0, 0, -1]}
      style={{ fontSize: 20, color: 'red' }}
    />
  </ViroARScene>
);

export default HelloScene