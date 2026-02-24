import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBillboardReviews, submitBillboardReview } from '../services/apiService';

const ReviewSection = ({ billboardId, user, onReviewSubmitted }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (billboardId) {
            fetchReviews();
        }
    }, [billboardId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await getBillboardReviews(billboardId);
            if (data) setReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!user) return;
        if (!userComment.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            setSubmittingReview(true);
            const { error } = await submitBillboardReview(user.id, billboardId, userRating, userComment);

            if (error) throw error;

            alert('Review submitted successfully!');
            setShowReviewModal(false);
            setUserComment('');
            fetchReviews();
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            alert('Error submitting review: ' + err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
                <TouchableOpacity
                    style={styles.writeReviewBtn}
                    onPress={() => user ? setShowReviewModal(true) : alert('Please login to write a review')}
                >
                    <Text style={styles.writeReviewBtnText}>Write a Review</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="small" color="#667eea" style={{ marginVertical: 20 }} />
            ) : reviews.length === 0 ? (
                <View style={styles.emptyReviews}>
                    <Ionicons name="chatbubble-ellipses-outline" size={32} color="#ccc" />
                    <Text style={styles.emptyReviewsText}>No reviews yet. Be the first!</Text>
                </View>
            ) : (
                reviews.map((item) => (
                    <View key={item.id} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.reviewerInfo}>
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{item.profiles?.full_name?.charAt(0) || 'U'}</Text>
                                </View>
                                <View>
                                    <Text style={styles.reviewerName}>{item.profiles?.full_name || 'Anonymous'}</Text>
                                    <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingBadgeText}>{item.rating}</Text>
                            </View>
                        </View>
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                    </View>
                ))
            )}

            {/* Review Modal */}
            <Modal
                visible={showReviewModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowReviewModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Write a Review</Text>
                            <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ratingPicker}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                                    <Ionicons
                                        name={star <= userRating ? "star" : "star-outline"}
                                        size={32}
                                        color="#FFD700"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Feedback</Text>
                            <TextInput
                                style={styles.reviewInput}
                                value={userComment}
                                onChangeText={setUserComment}
                                placeholder="How was your experience?"
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, submittingReview && { opacity: 0.7 }]}
                            onPress={handleReviewSubmit}
                            disabled={submittingReview}
                        >
                            {submittingReview ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Review</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a2e',
    },
    writeReviewBtn: {
        backgroundColor: '#f0f2ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e6ff',
    },
    writeReviewBtnText: {
        color: '#667eea',
        fontWeight: '600',
        fontSize: 12,
    },
    emptyReviews: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    emptyReviewsText: {
        color: '#999',
        marginTop: 8,
        fontSize: 14,
    },
    reviewItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e0e6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#667eea',
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a2e',
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9e6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#856404',
        marginLeft: 3,
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a2e',
    },
    ratingPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 25,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    reviewInput: {
        width: '100%',
        backgroundColor: '#f8f9ff',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e6ff',
        minHeight: 100,
    },
    submitBtn: {
        backgroundColor: '#667eea',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ReviewSection;
