import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { getMapBillboards } from '../services/apiService';
import Constants from 'expo-constants';

MapboxGL.setAccessToken(
  Constants.expoConfig?.extra?.mapboxApiKey || "sk.eyJ1Ijoic2hhYmlyMTIzIiwiYSI6ImNtZTJndDJlZzBuZ3IyaXNhZW4xNmJ4bXkifQ.fXf9lCBKWt87GeRCzNcpsA" // Ensure this is not empty!
);

const CustomMark = () => {
  // 1. FIX: Set a default location (e.g., Mardan coordinates) so the map loads immediately
  const [userCoords, setUserCoords] = useState([72.03, 34.20]); // Longitude, Latitude for Mardan
  const [billboard, setBillboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch billboard data
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        const { data, error } = await getMapBillboards('Mardan');
        if (error) {
          console.error('Error fetching map billboards:', error);
          setBillboard([]);
        } else {
          setBillboard(data || []);
        }
      } catch (err) {
        console.error('Error in fetchBillboards:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBillboards();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
      // We don't need to block rendering on this anymore
      MapboxGL.locationManager.start();
    };

    init();

    return () => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  // 2. FIX: REMOVED "if (!userCoords) return null;"
  // The map will render immediately now.

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/satellite-v9"
        logoEnabled={false}
      >
        {/* 3. ADD: UserLocation component to show the "Blue Dot" */}
        <MapboxGL.UserLocation visible={true} />

        {/* Camera follows user */}
        <MapboxGL.Camera
          followUserLocation={true}
          followUserMode="normal"
          followPitch={45}
          followZoomLevel={15}
        // Optional: If you want to start at Mardan before finding user
        // defaultSettings={{
        //   centerCoordinate: [72.03, 34.20],
        //   zoomLevel: 12,
        // }}
        />

        {/* Markers */}
        {billboard.map((b) => (
          <MapboxGL.PointAnnotation
            key={b.id}
            id={String(b.id)} // Ensure ID is a string
            coordinate={b.coords} // Ensure this is [long, lat] array
            onSelected={() =>
              router.push({
                pathname: `/post/${b.id}`,
                params: b
              })
            }
          >
            <View style={styles.pin} />
            <MapboxGL.Callout title={b.title} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
};

export default CustomMark;

const styles = StyleSheet.create({
  map: { flex: 1 },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "tomato",
    borderColor: "white",
    borderWidth: 2, // Added border width to make it visible
  },
});