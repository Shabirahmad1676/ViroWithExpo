import React from 'react';
import { Viro3DObject, ViroAmbientLight, ViroARScene } from '@reactvision/react-viro';

const Object3d = () => {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" />

      <Viro3DObject
        source={require('../assets/models/humanHeart.obj')}
        resources={[
          require('../assets/models/humanHeart.mtl'),
          require('../assets/models/heart_texture.jpg'),
        ]}
        position={[0, 0, -1]}
        scale={[0.05, 0.05, 0.05]}
        type="OBJ"
      />
    </ViroARScene>
  );
};

export default Object3d;
