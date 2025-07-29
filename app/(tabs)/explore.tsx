import { StyleSheet, Image, Platform, View, TextInput, Button } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import ARImageRecognitionExample from "@/components/ARImageRecognitionExample";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

export default function TabTwoScreen() {
  const [message, setMessage] = useState("");
  const [placedMessage, setPlacedMessage] = useState("");
  const [markerFound, setMarkerFound] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Pass message and callbacks to AR scene
  const handleMessagePlace = () => {
    console.log("[Explore] handleMessagePlace, message:", message);
    setPlacedMessage(message);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      console.log("[Explore] Image picked:", result.assets[0].uri);
    }
  };

  useEffect(() => {
    console.log("[Explore] placedMessage updated:", placedMessage);
  }, [placedMessage]);

  useEffect(() => {
    console.log("[Explore] imageUri updated:", imageUri);
  }, [imageUri]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Small AR Camera View */}
      <View style={{ height: 300, borderWidth: 1, borderColor: "#ccc", marginVertical: 8 }}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: ARImageRecognitionExample }}
          viroAppProps={{
            placedMessage,
            setMarkerFound,
            imageUri,
          }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Message Input UI below camera */}
      <View style={{ padding: 16 }}>
        <ThemedText type="subtitle">
          {markerFound ? "Marker recognized! Place or edit your message below:" : "Point your camera at the marker to enable messaging."}
        </ThemedText>
        <ThemedView style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          {Platform.OS === "web" ? (
            <input
              type="text"
              style={{ flex: 1, padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, fontSize: 16 }}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your AR message..."
              disabled={!markerFound}
            />
          ) : (
            <TextInput
              style={{ flex: 1, padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, fontSize: 16, color: "#222" }}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your AR message..."
              placeholderTextColor="#888"
              editable={markerFound}
            />
          )}
          {Platform.OS === "web" ? (
            <button
              style={{ marginLeft: 8, padding: 8, borderRadius: 4, backgroundColor: markerFound ? "#007AFF" : "#ccc", color: "#fff", border: "none", fontSize: 16 }}
              onClick={handleMessagePlace}
              disabled={!markerFound || !message.trim()}
            >
              {placedMessage ? "Update" : "Place"}
            </button>
          ) : (
            <Button
              title={placedMessage ? "Update" : "Place"}
              onPress={handleMessagePlace}
              disabled={!markerFound || !message.trim()}
            />
          )}
        </ThemedView>
        <Button
          title={imageUri ? "Change Image" : "Upload Image"}
          onPress={handlePickImage}
        />
        {imageUri && (
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            <ThemedText type="default" style={{ marginTop: 4 }}>
              Preview
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
