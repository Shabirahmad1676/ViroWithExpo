import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform, Alert, ActivityIndicator, Image } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { getMapBillboards } from '../services/apiService';

// Set Access Token
const mapboxToken = Constants.expoConfig?.extra?.mapboxApiKey || "sk.eyJ1Ijoic2hhYmlyMTIzIiwiYSI6ImNtZTJndDJlZzBuZ3IyaXNhZW4xNmJ4bXkifQ.fXf9lCBKWt87GeRCzNcpsA";
MapboxGL.setAccessToken(mapboxToken);

const MapboxMap = ({ focusCoords, focusId }) => {
    const router = useRouter();
    const cameraRef = useRef(null);

    const [billboards, setBillboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // requesting permission
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission to access location was denied');
                    return;
                }
                setPermissionGranted(true);

                let location = await Location.getCurrentPositionAsync({});
                setUserLocation([location.coords.longitude, location.coords.latitude]);
            } catch (error) {
                console.warn("Location permission error:", error);
            }
        })();
    }, []);

    // Listen for Focus Coords (Directions)
    useEffect(() => {
        if (focusCoords && cameraRef.current) {
            console.log("Flying to focus coords:", focusCoords);
            cameraRef.current.setCamera({
                centerCoordinate: focusCoords,
                zoomLevel: 16,
                animationDuration: 1500,
            });
        }
    }, [focusCoords]);

    useEffect(() => {
        fetchBillboards();
    }, []);

    const fetchBillboards = async () => {
        try {
            setLoading(true);
            const { data, error } = await getMapBillboards('Mardan');
            if (error) {
                console.error('Error fetching map billboards:', error);
            } else {
                // Filter out invalid coordinates to prevent crashes
                const validBillboards = (data || []).filter(b =>
                    Array.isArray(b.coords) &&
                    b.coords.length === 2 &&
                    !isNaN(b.coords[0]) &&
                    !isNaN(b.coords[1])
                );
                console.log("Map Billboards Data Check:", validBillboards.length, "items. Sample:", validBillboards[0]);
                setBillboards(validBillboards);
            }
        } catch (err) {
            console.error('Error in fetchBillboards:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRecenter = () => {
        if (userLocation && cameraRef.current) {
            cameraRef.current.setCamera({
                centerCoordinate: userLocation,
                zoomLevel: 15,
                animationDuration: 1000,
            });
        } else {
            // Fallback or re-fetch location if null
            (async () => {
                const location = await Location.getCurrentPositionAsync({});
                const newLoc = [location.coords.longitude, location.coords.latitude];
                setUserLocation(newLoc);
                cameraRef.current?.setCamera({
                    centerCoordinate: newLoc,
                    zoomLevel: 15,
                    animationDuration: 1000,
                });
            })();
        }
    };

    const onMarkerPress = (billboard) => {
        // FIX: Use billboard_id if available (it matches the billboards table uuid), falling back to id
        const targetId = billboard.billboard_id || billboard.id;
        console.log("Navigating to billboard:", targetId);
        router.push(`/post/${targetId}`);
    };

    return (
        <View style={styles.container}>
            <MapboxGL.MapView
                style={styles.map}
                styleURL="mapbox://styles/mapbox/satellite-v9"
                logoEnabled={false}
                attributionEnabled={false}
            >
                <MapboxGL.UserLocation
                    visible={true}
                    onUpdate={(loc) => {
                        if (loc?.coords) {
                            setUserLocation([loc.coords.longitude, loc.coords.latitude]);
                        }
                    }}
                />

                <MapboxGL.Camera
                    ref={cameraRef}
                    followUserLocation={true}
                    followUserMode="normal"
                    followZoomLevel={14}
                />

                {billboards.map((b) => (
                    <MapboxGL.PointAnnotation
                        key={b.id.toString()}
                        id={b.id.toString()}
                        coordinate={b.coords}
                        onSelected={() => onMarkerPress(b)}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.markerContent}>
                                {b.image_url ? (
                                    <Image
                                        source={{ uri: b.image_url }}
                                        style={styles.markerImage}
                                        resizeMode="cover"
                                        onError={(e) => console.log("Image load error for", b.id, e.nativeEvent.error)}
                                    />
                                ) : (
                                    <Ionicons name="business" size={20} color="#667eea" />
                                )}
                            </View>
                            <View style={styles.markerArrow} />
                        </View>
                    </MapboxGL.PointAnnotation>
                ))}
            </MapboxGL.MapView>

            {/* Recenter Button */}
            <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter}>
                <Ionicons name="locate" size={24} color="#667eea" />
            </TouchableOpacity>

            {/* Loading Indicator */}
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="small" color="#667eea" />
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden', // Ensures map doesn't overflow container corners if rounded
    },
    map: {
        flex: 1,
    },
    recenterBtn: {
        position: 'absolute',
        bottom: 30, // Above the tab bar (approx)
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loader: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 70,
    },
    markerContent: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 2,
    },
    markerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee', // Light gray background to show if image is loading/missing transparently
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff', // Matches the border of the content
        marginTop: -2, // Pull it up slightly to merge
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        zIndex: 1,
    }
});

export default MapboxMap;
