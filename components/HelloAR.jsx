import {
  ViroARScene,
  ViroText,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
  ViroAnimations,
} from "@reactvision/react-viro";


//this is for adding texture
ViroMaterials.createMaterials({
        wood:{
            // diffuseTexture:require('../assets/wood.jpg')
            diffuseTexture:require('../assets/wood.jpg')
        }
    })


//this is for applying animation...
ViroAnimations.registerAnimations({
  loopRotate: {
    properties: {
      rotateY: '+=45',
      rotateX: '+=90',
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

      {/* ViroBox */}
      <ViroBox
          animation={{name: 'loopRotate',run:true, loop: true}}
        position={[0, 0, -2]}
        scale={[0.9, 0.9, 0.9]}
        materials={["wood"]}
      />

    </ViroARScene>
  );
};

export default HelloAR;
