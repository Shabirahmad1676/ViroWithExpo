import {
  ViroARScene,
  ViroText,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
  ViroAnimations
} from "@reactvision/react-viro";
import { Text } from "react-native";


//this is for adding texture
ViroMaterials.createMaterials({
        wood:{
            diffuseTexture:require('../assets/wood.jpg')
        }
    })


//this is for applying animation...
ViroAnimations.registerAnimations({
  loopRotate: {
    properties: {
      rotateY: '+=45',
      rotateX: '+=45',
      
    }, 
    duration: 1000
  },
});


const HelloAR = () => {

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" />
      {/* <ViroText
        text={"Hello"}
        position={[0, 4, -4]} // Place 1 meter in front of the user
        scale={[0.5, 0.5, 0.5]}
        style={{fontSize:30,color:'red'}}
      /> */}
      <ViroBox
          animation={{name: 'loopRotate', run: true, loop: true}}
        height={2}
        length={2}
        width={2}
        position={[0, 0, -4]}
        scale={[0.2, 0.2, 0.2]}
        materials={["wood"]}
      />
    </ViroARScene>
  );
};

export default HelloAR;
