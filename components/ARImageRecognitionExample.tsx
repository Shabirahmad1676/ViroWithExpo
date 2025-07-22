import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroBox,
  ViroText,
  ViroAmbientLight,
  ViroImage,
} from "@reactvision/react-viro";
import { useGeoARMessages, GeoARMessage } from "./useGeoARMessages";
import * as Location from "expo-location";

// Register the image target only once
if (Platform.OS === "ios" || Platform.OS === "android") {
  ViroARTrackingTargets.createTargets({
    sampleTarget: {
      // source: require("../assets/business_card.png"),
      source: require("../assets/huz.jpeg"),
      orientation: "Down",
      physicalWidth: 0.1, // meters (adjust as needed)
    },
  });
}

// Accept props from vir oAppProps for live updates
export default function ARImageRecognitionExample(props: any) {
  // Extract from viroAppProps
  const placedMessage = props.sceneNavigator?.viroAppProps?.placedMessage || "";
  const setMarkerFound =
    props.sceneNavigator?.viroAppProps?.setMarkerFound || (() => {});
  const imageUri = props.sceneNavigator?.viroAppProps?.imageUri || null;

  const handleAnchorFound = () => {
    console.log("[ARImageRecognitionExample] Marker anchor found");
    setMarkerFound(true);
  };

  React.useEffect(() => {
    console.log(
      "[ARImageRecognitionExample] placedMessage prop updated:",
      placedMessage
    );
    console.log("[ARImageRecognitionExample] imageUri prop updated:", imageUri);
  }, [placedMessage, imageUri]);

  // --- Geo AR messages ---
  const geoMessages = useGeoARMessages();
  const [userLocation, setUserLocation] = React.useState<{ latitude: number; longitude: number } | null>(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    })();
  }, []);

  // Helper: distance in meters between two lat/lng
  function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const dPhi = (lat2-lat1) * Math.PI/180;
    const dLambda = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dPhi/2) * Math.sin(dPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda/2) * Math.sin(dLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Show geo-messages within 50 meters
  const visibleGeoMessages = (userLocation && geoMessages.length > 0)
    ? geoMessages.filter(m => getDistanceMeters(m.latitude, m.longitude, userLocation.latitude, userLocation.longitude) < 50)
    : [];

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      <ViroARImageMarker
        target="sampleTarget"
        onAnchorFound={handleAnchorFound}>
        {imageUri ? (
          <ViroImage
            // source={{ uri: imageUri }}
            source={{
              uri: "https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fn0b4on1v9kve1.jpeg",
            }}
            position={[0, 0.05, 0]}
            scale={[0.15, 0.15, 0.01]}
            rotation={[0, 0, 0]}
            placeholderSource={require("../assets/huz.jpeg")}
          />
        ) : (
          <ViroBox position={[0, 0.05, 0]} scale={[0.05, 0.05, 0.01]} />
        )}
        {placedMessage && placedMessage.trim().length > 0 ? (
          <ViroText
            text={placedMessage}
            position={[0, 0.15, 0]}
            scale={[0.02, 0.02, 0.02]}
            style={{ color: "#00FF00" }}
            onClick={() =>
              console.log("[ARImageRecognitionExample] ViroText clicked")
            }
          />
        ) : (
          <ViroText
            text="Image Recognized!"
            position={[0, 0.15, 0]}
            scale={[0.02, 0.02, 0.02]}
            style={{ color: "#00FF00" }}
          />
        )}
        {/* --- Geo-anchored AR messages --- */}
        {visibleGeoMessages.map((msg, idx) => (
          <ViroText
            key={msg.id}
            text={msg.message}
            position={[0.5 + idx * 0.5, 0.1, 0]}
            rotation={[0, 0, 0]}
            scale={[0.08, 0.08, 0.08]}
            style={styles.geoText}
            width={1.2}
            height={0.25}
          />
        ))}
      </ViroARImageMarker>
    </ViroARScene>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  inputBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: 280,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  editButtonContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
  },
  editButtonBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  geoText: {
    fontSize: 20,
    color: "#FF8800",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 8,
    padding: 8,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
