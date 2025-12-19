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

const MapboxMap = ({ focusCoords, focusId, searchQuery = '', category = 'all', showDirection = false }) => {
    const router = useRouter();
    const cameraRef = useRef(null);

    const [billboards, setBillboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [routeGeoJSON, setRouteGeoJSON] = useState(null);
    const [routeDetails, setRouteDetails] = useState(null);

    // Filter Logic
    const filteredBillboards = React.useMemo(() => {
        return billboards.filter(b => {
            // 1. Search Filter
            const matchesSearch = !searchQuery ||
                (b.title?.toLowerCase().includes(searchQuery.toLowerCase()));

            // 2. Category Filter
            const matchesCategory = category === 'all' ||
                (b.category?.toLowerCase() === category.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }, [billboards, searchQuery, category]);

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

    // Fetch Route when Direction is requested
    useEffect(() => {
        if (showDirection && userLocation && focusCoords && mapboxToken) {
            fetchRoute(userLocation, focusCoords);
        }
    }, [showDirection, userLocation, focusCoords]);

    const fetchRoute = async (start, end) => {
        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxToken}`;
            const response = await fetch(url);
            // console.log('response of map', response)
            const json = await response.json();

            if (json.routes && json.routes.length > 0) {
                const route = json.routes[0];
                setRouteGeoJSON({
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry,
                });
                setRouteDetails({
                    duration: route.duration,
                    distance: route.distance,
                });

                // Fit bounds to show entire route
                // Simple bbox calculation or camera fit could be done here if needed
                // console.log("Route fetched successfully");
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

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
                console.log("Map Billboards Data Check:", validBillboards.length, "items");
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
        console.log("Billboard Image URL:", billboard.image_url);
        router.push(`/post/${targetId}`);
    };

    return (
        <View style={styles.container}>
            <MapboxGL.MapView
                style={styles.map}
                styleURL="mapbox://styles/mapbox/navigation-night-v1"
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
                    followZoomLevel={16}
                    followPitch={45}
                />

                {/* 3D Buildings */}
                <MapboxGL.FillExtrusionLayer
                    id="building3d"
                    sourceID="composite"
                    sourceLayer="building"
                    filter={['==', 'extrude', 'true']}
                    minZoomLevel={12}
                    style={{
                        fillExtrusionColor: '#aaa',
                        fillExtrusionHeight: ['get', 'height'],
                        fillExtrusionBase: ['get', 'min_height'],
                        fillExtrusionOpacity: 0.6,
                    }}
                />

                {/* Draw Route Line */}
                {routeGeoJSON && (
                    <MapboxGL.ShapeSource id="routeSource" shape={routeGeoJSON}>
                        <MapboxGL.LineLayer
                            id="routeFill"
                            style={{
                                lineColor: 'red',
                                lineWidth: 10,
                                lineCap: 'round',
                                lineJoin: 'round',
                                lineOpacity: 0.8,
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}

                {filteredBillboards.map((b) => (
                    <MapboxGL.PointAnnotation
                        key={b.id.toString()}
                        id={b.id.toString()}
                        coordinate={b.coords}
                        onSelected={() => onMarkerPress(b)}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.markerContent}>
                                <Image
                                    source={{ uri: b.image_url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop' }}
                                    style={styles.markerImage}
                                    resizeMode="cover"
                                    onError={(e) => console.log("MARKER IMAGE ERROR:", b.id, e.nativeEvent.error)}
                                />
                            </View>
                            {/* <View style={styles.markerArrow} /> */}
                        </View>
                    </MapboxGL.PointAnnotation>
                ))}
            </MapboxGL.MapView>

            {/* Trip Details Card */}
            {routeDetails && (
                <View style={styles.tripCard}>
                    <View style={styles.tripInfo}>
                        <Ionicons name="time" size={24} color="#ff4757" />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.tripDuration}>
                                {Math.round(routeDetails.duration / 60)} min
                            </Text>
                            <Text style={styles.tripDistance}>
                                {(routeDetails.distance / 1000).toFixed(1)} km
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.closeTripBtn}
                        onPress={() => {
                            setRouteGeoJSON(null);
                            setRouteDetails(null);
                        }}
                    >
                        <Ionicons name="close" size={20} color="#000000ff" />
                    </TouchableOpacity>
                </View>
            )}

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
    tripCard: {
        position: 'absolute',
        bottom: 100, // Above recenter button
        left: 20,
        right: 80,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    tripInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tripDuration: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a2e',
    },
    tripDistance: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    closeTripBtn: {
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    // ... existing marker styles ...
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 70, // Increased height to accommodate arrow
    },
    markerContent: {
        width: 70,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#e0e0e0', // Light grey to show loading state
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 2,
        overflow: 'hidden',
    },
    markerImage: {
        width: 70,
        height: 50,
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'red',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff',
        marginTop: -1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        zIndex: 1,
    }
});

export default MapboxMap;
