// components/Map.js
import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { getMapBillboards } from '../services/apiService';
import Constants from 'expo-constants';

MapboxGL.setAccessToken(
  Constants.expoConfig?.extra?.mapboxApiKey || "sk.eyJ1Ijoic2hhYmlyMTIzIiwiYSI6ImNtZTJndDJlZzBuZ3IyaXNhZW4xNmJ4bXkifQ.fXf9lCBKWt87GeRCzNcpsA"
);

const CustomMark = () => {
  const [userCoords, setUserCoords] = useState(null);
  const [billboard, setBillboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch billboard data for map
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
          console.log('Map billboards loaded:', data?.length || 0);
        }
      } catch (err) {
        console.error('Error in fetchBillboards:', err);
        setBillboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBillboards();
  }, []);


  useEffect(() => {
    //to get user permission
    const init = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }

      // Get user location once
      const location = await MapboxGL.locationManager.getLastKnownLocation();
      // console.log('location=>',location);
      if (location?.coords) {
        setUserCoords([location.coords.longitude, location.coords.latitude]);
        // console.log("user locaton=>", userCoords);
      }
    };

    init();

    // Start listening for location updates
    MapboxGL.locationManager.start();

    return () => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  if (!userCoords) return null;

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/satellite-v9"
        logoEnabled={false} // hides the small “Mapbox” logo watermark.
      >
        {/* Camera follows user */}
        <MapboxGL.Camera
          followUserLocation={true}
          followUserMode="normal"
          followPitch={45}
          followZoomLevel={18}
        />

        {/*Mapbox marker*/}
        {billboard.map((b) => (
          <MapboxGL.PointAnnotation
            key={b.id}
            id={b.id}
            // draggable
            // onDragEnd={(e) => {
            //   const { coordinates } = e.geometry; // [longitude, latitude]
            //   console.log(`New location for ${b.title}:`, coordinates);
            // }}
            coordinate={b.coords}
            onSelected={() =>
              router.push({
                pathname: `/post/${b.id}`,
                params: b
              })
            }
            // onPress={() => console.log(`${b.title} tapped`)}
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
  },
});
