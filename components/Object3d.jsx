// import React, { useState } from "react";
// import {
//   Viro3DObject,
//   ViroAmbientLight,
//   ViroARScene,
//   ViroAnimations,
// } from "@reactvision/react-viro";
// import { use } from "react";

// //this is for applying animation...
// ViroAnimations.registerAnimations({
//   loopRotate: {
//     properties: {
//       rotateY: "+=45",
//       // rotateX: "+=90",
//     },
//     duration: 1000,
//   },
// });

// const Object3d = () => {

//   const[isAnimate,setIsAnimate] = useState(false);

//   const handleTap = ()=>{
//     console.log("Animate?", isAnimate);
//     setIsAnimate(!isAnimate);
//   }

//   // const handleLoadStart = () => {
//   //   console.log("OBJ loading has started");   
//   // }  
//   // const handleLoadEnd = () => {
//   //   console.log("OBJ loading has finished");
//   // }
//   // const handleError=(event)=>{
//   //   console.log("OBJ loading failed with error: " + event.nativeEvent.error);  
//   // }


//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="#FFFFFF" />

//       {/* <Viro3DObject
//         // animation={{ name: "loopRotate", run: true, loop: true }}
//         source={require('../assets/models/humanHeart.obj')}
//         // resources={[
//         //   require('../assets/models/humanHeart.mtl'),
//         //   require('../assets/models/heart_texture.jpg'),
//         // ]}
//         position={[0, 0, -1]}
//         scale={[1, 1, 1]}
//         rotation={[-45,50,45]}
//         type="OBJ"
//       /> */}

//        <Viro3DObject
//         animation={{ name: "loopRotate", run: isAnimate, loop: true }}
//         source={require("../assets/heart.glb")}
//         position={[0, 0, -2]}
//         scale={[0.5, 0.5, 0.5]}
//         onClick={handleTap}
//         // rotation={[-45,50,45]}
//         type="GLB"
//         //   onLoadStart={handleLoadStart}
//         // onLoadEnd={handleLoadEnd}
//         // onError={handleError}
//       />


//     </ViroARScene>
//   );
// };

// export default Object3d;
