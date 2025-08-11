// components/Map.js
import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken(
  "sk.eyJ1Ijoic2hhYmlyMTIzIiwiYSI6ImNtZTJndDJlZzBuZ3IyaXNhZW4xNmJ4bXkifQ.fXf9lCBKWt87GeRCzNcpsA"
);

const Map = () => {
  const [userCoords, setUserCoords] = useState(null);

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
      console.log(location)
      if (location?.coords) {
        setUserCoords([location.coords.longitude, location.coords.latitude]);
        console.log("user locaton", userCoords);
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
        // styleURL={MapboxGL.StyleURL.Satellite-v9}
        styleURL="mapbox://styles/mapbox/satellite-v9"
        //MapboxGL.StyleURL.Street → Default street map
        //Dark → Dark theme map
        //Light → Light theme map
        //Outdoors → Hiking / outdoor-friendly map
        //Satellite → Satellite imagery
        //SatelliteStreet → Satellite imagery with roads and labels
        //TrafficNight → Traffic layer, night style
        //TrafficDay → Traffic layer, day style

        logoEnabled={false} // hides the small “Mapbox” logo watermark.
      >
        {/* Show user location on map, it will show by default a green like circle */} 
        {/* 
         */}

        {/* Camera follows user */}
        <MapboxGL.Camera
          followUserLocation={true}
          followUserMode="normal"
          followPitch={45}
          followZoomLevel={18}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/*Mapbox marker*/}
        <MapboxGL.PointAnnotation
          id="marker-1"
          coordinate={userCoords}
        //   draggable
          onPress={() => console.log("marker tapped")}
        >
          <View style={styles.pin} />
          <MapboxGL.Callout title="I am shabir!" />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
    </View>
  );
};

export default Map;

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
