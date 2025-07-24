import React from 'react';
import { ViroARScene, ViroText, ViroARSceneNavigator } from '@reactvision/react-viro';
import HelloScene from '../components/HelloScene'


export default function index() {
  return (
    <ViroARSceneNavigator
      initialScene={{ scene: HelloScene }}
      style={{ flex: 1 }}
    />
  );
}
