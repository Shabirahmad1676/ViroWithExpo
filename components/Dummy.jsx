// import React, { useState } from 'react';
// import { StyleSheet, Linking } from 'react-native';
// import {
//   ViroARSceneNavigator,
//   ViroARScene,
//   ViroText,
//   ViroARImageMarker,
//   ViroARTrackingTargets,
//   ViroNode,
//   ViroAmbientLight,
//   ViroFlexView,
//   ViroAnimations,
// } from '@reactvision/react-viro';

// // 1. REGISTER TARGET (Your Banner)
// ViroARTrackingTargets.createTargets({
//   arMarker: {
//     source: require('../../assets/ar1.jpg'), // ⚠️ Check this path
//     orientation: 'Up',
//     physicalWidth: 0.72, // 72cm
//   },
// });

// // 2. REGISTER ANIMATION
// ViroAnimations.registerAnimations({
//   popIn: {
//     properties: { scaleX: 1, scaleY: 1, scaleZ: 1, opacity: 1 },
//     easing: 'Bounce',
//     duration: 500,
//   },
// });

// const InteractiveScene = () => {
//   const [showMenu, setShowMenu] = useState(false);

//   // --- ACTIONS ---
//   const openURL = () => {
//     console.log("Opening Website...");
//     Linking.openURL('https://www.google.com'); // <--- REPLACE WITH YOUR WEBSITE
//   };

//   const contactOnWhatsApp = () => {
//     console.log("Opening WhatsApp...");
//     // Replace with your number (Country code + Number, no dashes or plus signs)
//     // Example: 92 for Pakistan, then the number.
//     Linking.openURL('whatsapp://send?phone=923001234567');
//   };

//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="#FFFFFF" />

//       <ViroARImageMarker
//         target="arMarker"
//         onAnchorFound={() => setShowMenu(true)}
//         onAnchorLost={() => setShowMenu(false)}
//       >
//         {/* Container Node */}
//         <ViroNode
//           position={[0, -0.2, 0.05]} // Positioned slightly in front of banner
//           scale={[0, 0, 0]}        // Start hidden
//           rotation={[0, 0, 0]}     // Face the user
//           animation={{ name: 'popIn', run: showMenu }}
//         >

//           {/* --- WEBSITE BUTTON (Blue) --- */}
//           <ViroFlexView
//             style={styles.buttonBlue}
//             width={0.5}
//             height={0.12}
//             position={[0, 0.1, 0]} // Top Button
//             onClick={openURL}      // <--- CLICK HANDLER
//           >
//             <ViroText text="🌐 Website" style={styles.buttonText} />
//           </ViroFlexView>

//           {/* --- WHATSAPP BUTTON (Green) --- */}
//           <ViroFlexView
//             style={styles.buttonGreen}
//             width={0.5}
//             height={0.12}
//             position={[0, -0.1, 0]} // Bottom Button
//             onClick={contactOnWhatsApp} // <--- CLICK HANDLER
//           >
//             <ViroText text="💬 WhatsApp" style={styles.buttonText} />
//           </ViroFlexView>

//         </ViroNode>
//       </ViroARImageMarker>
//     </ViroARScene>
//   );
// };

// export default () => {
//   return (
//     <ViroARSceneNavigator
//       autofocus={true}
//       initialScene={{ scene: InteractiveScene }}
//       style={styles.arContainer}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   arContainer: {
//     flex: 1,
//   },
//   // Blue Button Style
//   buttonBlue: {
//     backgroundColor: '#0000ff', // Blue
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 0.02,
//   },
//   // Green Button Style
//   buttonGreen: {
//     backgroundColor: '#25D366', // WhatsApp Green
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 0.02,
//   },
//   buttonText: {
//     fontFamily: 'Arial',
//     fontSize: 25,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
        //   Another dummy Just hello world
        // import {
        //   ViroARScene,
        //   ViroARSceneNavigator,
        //   ViroText,
        //   ViroTrackingStateConstants,
        // } from "@reactvision/react-viro";
        // import React, { useState } from "react";
        // import { StyleSheet } from "react-native";
        
        // const HelloWorldSceneAR = () => {
        //   const [text, setText] = useState("Initializing AR...");
        
        //   function onInitialized(state, reason) {
        //     console.log("onInitialized", state, reason);
        //     if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
        //       setText("Hello World!");
        //     } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
        //       // Handle loss of tracking
        //     }
        //   }
        
        //   return (
        //     <ViroARScene onTrackingUpdated={onInitialized}>
        //       <ViroText
        //         text={text}
        //         scale={[0.5, 0.5, 0.5]}
        //         position={[0, 0, -1]}
        //         style={styles.helloWorldTextStyle}
        //       />
        //     </ViroARScene>
        //   );
        // };
        
        // export default () => {
        //   return (
        //     <ViroARSceneNavigator
        //       autofocus={true}
        //       initialScene={{
        //         scene: HelloWorldSceneAR,
        //       }}
        //       style={styles.f1}
        //     />
        //   );
        // };
        
        // var styles = StyleSheet.create({
        //   f1: { flex: 1 },
        //   helloWorldTextStyle: {
        //     fontFamily: "Arial",
        //     fontSize: 30,
        //     color: "#ffffff",
        //     textAlignVertical: "center",
        //     textAlign: "center",
        //   },
        // });