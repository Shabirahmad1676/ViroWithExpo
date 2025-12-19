import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native'; // Use Clipboard from react-native or expo-clipboard
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn } from './animations';
import SwipeableButton from './SwipeableButton';

const CouponCard = ({ title, discountAmount, discountCode, expiryDate }) => {
    const [redeemed, setRedeemed] = useState(false);

    const handleRedeem = async () => {
        // Haptics
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Copy to clipboard
        Clipboard.setString(discountCode);

        setRedeemed(true);
    };

    return (
        <FadeIn>
            <View style={styles.card}>
                {/* Left Side: Ticket Stub Visualization */}
                <View style={styles.leftStub}>
                    <View style={styles.hole} />
                    <Ionicons name="pricetag" size={24} color="#fff" />
                    <Text style={styles.verticalText}>COUPON</Text>
                    <View style={[styles.hole, { top: 'auto', bottom: -10 }]} />
                </View>

                {/* Right Side: Content */}
                <View style={styles.content}>
                    <Text style={styles.discountText}>{discountAmount}</Text>
                    <Text style={styles.titleText} numberOfLines={2}>{title}</Text>
                    <Text style={styles.expiryText}>
                        Valid until: {(() => {
                            try {
                                return expiryDate ? new Date(expiryDate).toLocaleDateString() : 'Never expires';
                            } catch (e) {
                                return 'Never expires';
                            }
                        })()}
                    </Text>

                    {/* Action Area */}
                    <View style={styles.actionArea}>
                        {redeemed ? (
                            <View style={styles.codeDisplay}>
                                <Text style={styles.codeLabel}>Code Copied!</Text>
                                <Text style={styles.codeValue}>{discountCode}</Text>
                            </View>
                        ) : (
                            <View style={{ width: '100%' }}>
                                {discountCode ? (
                                    <SwipeableButton
                                        label="Slide to Reveal"
                                        onSwipeSuccess={handleRedeem}
                                        width="100%"
                                    />
                                ) : (
                                    <View style={styles.unavailableBadge}>
                                        <Text style={styles.unavailableText}>Code Unavailable</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </FadeIn>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        minHeight: 140, // Increased height for slider
    },
    leftStub: {
        width: 50,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderRightColor: '#fff',
        borderStyle: 'dashed',
        position: 'relative',
    },
    hole: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f8f9ff',
        position: 'absolute',
        top: -10,
        left: 15,
    },
    verticalText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        fontWeight: 'bold',
        transform: [{ rotate: '-90deg' }],
        width: 60,
        textAlign: 'center',
        marginTop: 20,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    discountText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#667eea',
    },
    titleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: 4,
        opacity: 0.8,
    },
    expiryText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 12,
    },
    actionArea: {
        marginTop: 4,
        minHeight: 50,
        justifyContent: 'center',
    },
    codeDisplay: {
        backgroundColor: '#f0f9f4',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#c3e6cb',
    },
    codeLabel: {
        color: '#2e7d32',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    codeValue: {
        color: '#1b5e20',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 2,
    },
    unavailableBadge: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    unavailableText: {
        color: '#999',
        fontSize: 12,
    }
});

export default CouponCard;
