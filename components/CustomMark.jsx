// components/Map.js
import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useRouter } from "expo-router";
MapboxGL.setAccessToken(
  ""
);

const CustomMark = () => {
  const [userCoords, setUserCoords] = useState(null);
   const router = useRouter();
  const billboards = [
    { id: "bb1", coords: [72.0232308, 34.1473818], title: "CocaCola Billboard", description: "Limited time offer on Coke!", },
    {
      id: "bb2",
      coords: [72.02433945831493, 34.14760014202241],
      title: "Nike Billboard",
       description: "New Shoes Lunch - 20% off!",
    },
    {
      id: "bb3",
      coords: [72.02356961147274, 34.14755714632831],
      title: "KFC Happy 14th Aug",
      description:'Buy 1 Get 1 Free'
    },
  ];

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
      console.log('location=>',location);
      if (location?.coords) {
        setUserCoords([location.coords.longitude, location.coords.latitude]);
        console.log("user locaton=>", userCoords);
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
        {billboards.map((b) => (
          <MapboxGL.PointAnnotation
            key={b.id}
            id={b.id}
            // draggable
            // onDragEnd={(e) => {
            //   const { coordinates } = e.geometry; // [longitude, latitude]
            //   console.log(`New location for ${b.title}:`, coordinates);
            // }}
            coordinate={b.coords}
            onSelected={() => router.push({ pathname: `/post/${b.id}`, params: b })}
            onPress={() => console.log(`${b.title} tapped`)}
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
