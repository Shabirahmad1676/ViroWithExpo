import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { FadeIn } from './animations';

const CouponCard = ({ title, discountAmount, discountCode, expiryDate, valid = true }) => {
    const [showQR, setShowQR] = useState(false);

    return (
        <>
            <FadeIn>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => discountCode && setShowQR(true)}
                    activeOpacity={discountCode ? 0.9 : 1}
                >
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

                        <View style={styles.ctaRow}>
                            <Text style={[styles.tapText, !discountCode && { color: '#999' }]}>
                                {discountCode ? 'Tap to Redeem' : 'Code Unavailable'}
                            </Text>
                            {discountCode && <Ionicons name="chevron-forward" size={16} color="#667eea" />}
                        </View>
                    </View>
                </TouchableOpacity>
            </FadeIn>

            {/* QR Code Modal */}
            <Modal
                visible={showQR}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowQR(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Scan to Redeem</Text>
                        <Text style={styles.modalSubtitle}>Show this code to the cashier</Text>

                        {discountCode ? (
                            <>
                                <View style={styles.qrContainer}>
                                    <QRCode
                                        value={discountCode}
                                        size={200}
                                        color="black"
                                        backgroundColor="white"
                                    />
                                </View>

                                <View style={styles.codeContainer}>
                                    <Text style={styles.codeLabel}>Code:</Text>
                                    <Text style={styles.codeValue}>{discountCode}</Text>
                                </View>
                            </>
                        ) : (
                            <View style={[styles.qrContainer, { alignItems: 'center', justifyContent: 'center', height: 240 }]}>
                                <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
                                <Text style={{ marginTop: 16, color: '#666', textAlign: 'center' }}>
                                    No code available for this coupon.
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowQR(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
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
        height: 120,
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
        backgroundColor: '#f8f9ff', // Matches screen background
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
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    expiryText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    ctaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tapText: {
        fontSize: 12,
        color: '#667eea',
        fontWeight: '600',
        marginRight: 4,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    qrContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 30,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#f5f6fa',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    codeLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    codeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        letterSpacing: 1,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default CouponCard;
