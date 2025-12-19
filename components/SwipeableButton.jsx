import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 200; // Default, can be overridden
const SWIPE_THRESHOLD = 0.7; // 70% of width to trigger

const SwipeableButton = ({
    onSwipeSuccess,
    width = '100%',
    label = 'Slide to Claim'
}) => {
    const [complete, setComplete] = useState(false);
    const translateX = useSharedValue(0);
    const maxWidth = width === '100%' ? 280 : width; // Approximate internal width if % provided
    const maxDrag = maxWidth - BUTTON_HEIGHT - 10; // Padding

    // Wrapper function to be called from UI thread
    const handleComplete = (isSuccess) => {
        if (isSuccess) {
            setComplete(true);
            if (onSwipeSuccess) onSwipeSuccess();
        }
    };

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
        },
        onActive: (event, ctx) => {
            if (complete) return;
            let newValue = ctx.startX + event.translationX;
            // Clamp values
            if (newValue < 0) newValue = 0;
            if (newValue > maxDrag) newValue = maxDrag;

            translateX.value = newValue;
        },
        onEnd: () => {
            if (complete) return;
            if (translateX.value > maxDrag * SWIPE_THRESHOLD) {
                // Success
                translateX.value = withSpring(maxDrag);
                runOnJS(handleComplete)(true);
            } else {
                // Reset
                translateX.value = withSpring(0);
            }
        },
    });

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, maxDrag * 0.5],
            [1, 0],
            Extrapolate.CLAMP
        );
        return {
            opacity,
        };
    });

    const animatedBackgroundStyle = useAnimatedStyle(() => {
        const width = interpolate(
            translateX.value,
            [0, maxDrag],
            [BUTTON_HEIGHT, maxWidth], // Expands from circle to full width
            Extrapolate.CLAMP
        );
        return {
            width, // Optional: if we want the filling effect
        };
    });

    return (
        <View style={[styles.container, { width }]}>
            <View style={styles.track}>
                {/* Text Label */}
                <Animated.View style={[styles.labelContainer, animatedTextStyle]}>
                    <Text style={styles.label}>{label}</Text>
                    <Ionicons name="chevron-forward" size={14} color="#aaa" style={{ marginLeft: 4, opacity: 0.5 }} />
                    <Ionicons name="chevron-forward" size={14} color="#aaa" style={{ marginLeft: -8, opacity: 0.3 }} />
                </Animated.View>

                {/* Swipe Button */}
                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View style={[styles.button, animatedButtonStyle]}>
                        <LinearGradient
                            colors={complete ? ['#4CAF50', '#45a049'] : ['#667eea', '#764ba2']}
                            style={styles.gradient}
                        >
                            <Ionicons
                                name={complete ? "checkmark" : "arrow-forward"}
                                size={24}
                                color="#fff"
                            />
                        </LinearGradient>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: BUTTON_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    track: {
        width: '100%',
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT / 2,
        backgroundColor: '#f0f0f3',
        justifyContent: 'center',
        padding: 5,
        position: 'relative',
        overflow: 'hidden',
    },
    button: {
        width: BUTTON_HEIGHT - 10,
        height: BUTTON_HEIGHT - 10,
        borderRadius: (BUTTON_HEIGHT - 10) / 2,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 2,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: (BUTTON_HEIGHT - 10) / 2,
    },
    labelContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    label: {
        color: '#999',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 1,
    },
});

export default SwipeableButton;
