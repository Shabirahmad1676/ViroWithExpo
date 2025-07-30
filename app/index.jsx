import React from 'react';
import {
  ViroARSceneNavigator,
} from '@reactvision/react-viro';
import HelloAR from '../components/HelloAR';





const index = () => {
  return (
    <ViroARSceneNavigator
      initialScene={{ scene: HelloAR }}
    />
  );
};

export default index;