import React, { useState, useEffect } from "react";
import { View, Modal, TextInput, Button, Image, StyleSheet, Alert } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GeoARMessage {
  id: string;
  latitude: number;
  longitude: number;
  message: string;
  imageUri?: string;
}

export default function MapTabScreen() {
  const [region, setRegion] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newImageUri, setNewImageUri] = useState<string | undefined>(undefined);
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoMessages, setGeoMessages] = useState<GeoARMessage[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // Load saved geo-messages
      const stored = await AsyncStorage.getItem("geoARMessages");
      if (stored) setGeoMessages(JSON.parse(stored));
    })();
  }, []);

  const handleMapLongPress = (e: MapPressEvent) => {
    setSelectedCoord(e.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedCoord) return;
    const newGeoMsg: GeoARMessage = {
      id: Date.now().toString(),
      latitude: selectedCoord.latitude,
      longitude: selectedCoord.longitude,
      message: newMessage,
      imageUri: newImageUri,
    };
    const updated = [...geoMessages, newGeoMsg];
    setGeoMessages(updated);
    await AsyncStorage.setItem("geoARMessages", JSON.stringify(updated));
    setModalVisible(false);
    setNewMessage("");
    setNewImageUri(undefined);
    setSelectedCoord(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {region && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={region}
          onLongPress={handleMapLongPress}
        >
          {geoMessages.map(msg => (
            <Marker
              key={msg.id}
              coordinate={{ latitude: msg.latitude, longitude: msg.longitude }}
              title={msg.message}
              description={msg.imageUri ? "Has Image" : undefined}
            />
          ))}
        </MapView>
      )}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter your message"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            {/* Image picker can be added here if needed */}
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 300,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    width: "100%",
  },
});
