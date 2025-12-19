import React, { useState } from 'react';
import { StyleSheet, Linking, View, Text, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

// 1. REGISTER TARGET (Your Banner)
ViroARTrackingTargets.createTargets({
  arMarker: {
    source: require('../../assets/ar1.jpg'),
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
      console.log("❌ AR Tracking Unavailable");
      // Optional: Alert user here?
    }
  }

  // --- ACTIONS ---
  const openURL = () => Linking.openURL('https://www.google.com');
  const contactOnWhatsApp = () => Linking.openURL('whatsapp://send?phone=923001234567');

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#FFFFFF" />
      <ViroARImageMarker
        target="arMarker"
        onAnchorFound={() => setShowMenu(true)}
        onAnchorLost={() => setShowMenu(false)}
      >
        <ViroNode
          position={[0, -0.2, 0.05]}
          scale={[0, 0, 0]}
          animation={{ name: 'popIn', run: showMenu }}
        >
          <ViroFlexView style={styles.buttonBlue} width={0.5} height={0.12} position={[0, 0.1, 0]} onClick={openURL}>
            <ViroText text="🌐 Website" style={styles.buttonText} />
          </ViroFlexView>
          <ViroFlexView style={styles.buttonGreen} width={0.5} height={0.12} position={[0, -0.1, 0]} onClick={contactOnWhatsApp}>
            <ViroText text="💬 WhatsApp" style={styles.buttonText} />
          </ViroFlexView>
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

// --- MOCK MODE COMPONENT ---
const MockARView = () => {
  const [scanned, setScanned] = useState(false);

  const handleSimulateScan = () => {
    setScanned(true);
    Alert.alert("Mock Scan", "Target Detected Successfully! (Simulation)");
  };

  return (
    <View style={styles.mockContainer}>
      <ImageBackground
        source={require('../../assets/ar1.jpg')}
        style={styles.mockBackground}
        imageStyle={{ opacity: 0.3 }}
      >
        <Text style={styles.mockTitle}>Mock AR Mode</Text>
        <Text style={styles.mockSubtitle}>Point camera at target (Simulated)</Text>

        {!scanned ? (
          <TouchableOpacity style={styles.scanBtn} onPress={handleSimulateScan}>
            <Ionicons name="scan-circle" size={60} color="#667eea" />
            <Text style={styles.scanBtnText}>Tap to Scan</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.mockOverlay}>
            <TouchableOpacity style={styles.mockButtonBlue} onPress={() => Linking.openURL('https://www.google.com')}>
              <Text style={styles.mockButtonText}>🌐 Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mockButtonGreen} onPress={() => Linking.openURL('whatsapp://send?phone=923001234567')}>
              <Text style={styles.mockButtonText}>💬 WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={() => setScanned(false)}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default () => {
  const [isMockMode, setIsMockMode] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {isMockMode ? (
        <MockARView />
      ) : (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: InteractiveScene }}
          style={styles.arContainer}
        />
      )}

      {/* Mode Toggle Button */}
      <TouchableOpacity
        style={styles.toggleModeBtn}
        onPress={() => setIsMockMode(!isMockMode)}
      >
        <Ionicons name={isMockMode ? "camera" : "construct"} size={20} color="#fff" />
        <Text style={styles.toggleText}>
          {isMockMode ? "Real AR" : "Mock Mode"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  arContainer: { flex: 1 },
  // Viro Styles
  buttonBlue: { backgroundColor: '#0000ff', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  buttonGreen: { backgroundColor: '#25D366', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: 'Arial', fontSize: 25, color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },

  // Mock Styles
  mockContainer: { flex: 1, backgroundColor: '#000' },
  mockBackground: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mockTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', position: 'absolute', top: 60 },
  mockSubtitle: { fontSize: 16, color: '#ccc', position: 'absolute', top: 100 },
  scanBtn: { alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20 },
  scanBtnText: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#667eea' },

  mockOverlay: { alignItems: 'center', width: '100%' },
  mockButtonBlue: { backgroundColor: '#0000ff', padding: 15, width: 250, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  mockButtonGreen: { backgroundColor: '#25D366', padding: 15, width: 250, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  mockButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resetBtn: { marginTop: 20 },
  resetText: { color: '#aaa', fontSize: 16 },

  toggleModeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100, // Ensure it's on top
  },
  toggleText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
});