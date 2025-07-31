import React from 'react';
import {
  ViroARSceneNavigator,
} from '@reactvision/react-viro';
import HelloAR from '../components/HelloAR';
import Object3d from '../components/Object3d';





const index = () => {
  return (
    <ViroARSceneNavigator
    //   initialScene={{ scene: HelloAR }}
      initialScene={{ scene: Object3d }}
    />
  );
};

export default index;