import React, { useState } from 'react';
import { StyleSheet, Linking } from 'react-native';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroNode,
  ViroAmbientLight,
  ViroFlexView,
  ViroAnimations,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

// 1. REGISTER TARGET (Your Banner)
ViroARTrackingTargets.createTargets({
  arMarker: {
    source: require('../../assets/ar1.jpg'), // ⚠️ Check this path
    orientation: 'Up',
    physicalWidth: 0.72, // 72cm
  },
});

// 2. REGISTER ANIMATION
ViroAnimations.registerAnimations({
  popIn: {
    properties: { scaleX: 1, scaleY: 1, scaleZ: 1, opacity: 1 },
    easing: 'Bounce',
    duration: 500,
  },
});

const InteractiveScene = () => {
  const [showMenu, setShowMenu] = useState(false);

  function onInitialized(state, reason) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("✅ AR System Initialized & Ready");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      console.log("❌ AR Tracking Unavailable (Low light or blocked camera)");
    }
  }

  // --- ACTIONS ---
  const openURL = () => {
    console.log("🖱️ Website Button Tapped");
    Linking.openURL('https://www.google.com');
  };

  const contactOnWhatsApp = () => {
    console.log("🖱️ WhatsApp Button Tapped");
    // Replace with your number
    Linking.openURL('whatsapp://send?phone=923001234567');
  };

  // --- DETECTION HANDLERS (Added Logs Here) ---
  const handleAnchorFound = () => {
    console.log("🎯 BANNER DETECTED! Showing Buttons...");
    setShowMenu(true);
  };

  const handleAnchorLost = () => {
    console.log("💨 Banner Lost. Hiding Buttons...");
    setShowMenu(false);
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#FFFFFF" />

      <ViroARImageMarker
        target="arMarker"
        onAnchorFound={handleAnchorFound} // <--- Linked to log function
        onAnchorLost={handleAnchorLost}   // <--- Linked to log function
      >
        {/* Container Node */}
        <ViroNode
          position={[0, -0.2, 0.05]}
          scale={[0, 0, 0]}
          rotation={[0, 0, 0]}
          animation={{ name: 'popIn', run: showMenu }}
        >

          {/* --- WEBSITE BUTTON (Blue) --- */}
          <ViroFlexView
            style={styles.buttonBlue}
            width={0.5}
            height={0.12}
            position={[0, 0.1, 0]}
            onClick={openURL}
          >
            <ViroText text="🌐 Website" style={styles.buttonText} />
          </ViroFlexView>

          {/* --- WHATSAPP BUTTON (Green) --- */}
          <ViroFlexView
            style={styles.buttonGreen}
            width={0.5}
            height={0.12}
            position={[0, -0.1, 0]}
            onClick={contactOnWhatsApp}
          >
            <ViroText text="💬 WhatsApp" style={styles.buttonText} />
          </ViroFlexView>

        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{ scene: InteractiveScene }}
      style={styles.arContainer}
    />
  );
};

const styles = StyleSheet.create({
  arContainer: {
    flex: 1,
  },
  buttonBlue: {
    backgroundColor: '#0000ff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0.02,
  },
  buttonGreen: {
    backgroundColor: '#25D366',
    flexDirection: 'column', // I uncommented this to ensure text centers correctly
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0.02,
  },
  buttonText: {
    fontFamily: 'Arial',
    fontSize: 25,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});