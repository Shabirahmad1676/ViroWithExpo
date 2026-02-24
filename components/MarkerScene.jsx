import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARImageMarker,
  ViroAmbientLight,
  ViroARTrackingTargets,
  ViroText,
} from "@reactvision/react-viro";
import { Linking } from "react-native";
import { getBillboardByMarkerId, checkIfFavorite, addToFavorites, getBillboardCoupons, claimBillboardCoupon, getClaimedCouponIds } from "../services/apiService";
import { useAuth } from "../AuthContext/UserAuth";
import { Alert } from "react-native";

export default function MarkerScene() {
  const { user } = useAuth();
  const [markerVisible, setMarkerVisible] = useState(false);
  const [targetsLoaded, setTargetsLoaded] = useState(false);
  const [billboardData, setBillboardData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isClaimed, setIsClaimed] = useState(false);

  // Register marker target
  useEffect(() => {
    ViroARTrackingTargets.createTargets({
      logoMarker: {
        source: require("../assets/marker1.jpg"),
        orientation: "Up",
        physicalWidth: 0.1,
      },
    });
    setTimeout(() => setTargetsLoaded(true), 100);
  }, []);

  // Fetch billboard data when marker is found
  const fetchBillboard = async () => {
    try {
      const { data, error } = await getBillboardByMarkerId("logoMarker");

      if (error) {
        console.error("Error fetching billboard:", error.message);
      } else {
        setBillboardData(data);
        if (user) {
          await checkFavoriteStatus(data.marker_id);
          await fetchCoupons(data.id);
        }
        console.log("Billboard loaded:", data);
      }
    } catch (err) {
      console.error("Error in fetchBillboard:", err);
    }
  };

  const fetchCoupons = async (billboardId) => {
    try {
      const { data: allCoupons } = await getBillboardCoupons(billboardId);
      setCoupons(allCoupons || []);

      // Check if any of these are already claimed
      if (user && allCoupons && allCoupons.length > 0) {
        const { data: claimedIds } = await getClaimedCouponIds(user.id, allCoupons.map(c => c.id));
        if (claimedIds && claimedIds.length > 0) {
          setIsClaimed(true);
        }
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  const handleClaimARCoupon = async () => {
    if (!user || coupons.length === 0) return;

    try {
      const coupon = coupons[0]; // Claim the first one found for AR simplicity
      const { error } = await claimBillboardCoupon(user.id, billboardData.id, coupon.id);

      if (error) {
        Alert.alert("Offer", error.message || "Failed to claim coupon");
      } else {
        setIsClaimed(true);
        Alert.alert("Success!", `Coupon "${coupon.title}" saved to your coupons!`);
      }
    } catch (err) {
      console.error("Error claiming AR coupon:", err);
    }
  };

  const checkFavoriteStatus = async (markerId) => {
    if (!user) return;

    try {
      const { data, error } = await checkIfFavorite(user.id, markerId);
      if (!error && data) {
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  };

  const saveToFavorites = async () => {
    if (!user || !billboardData) return;

    try {
      const { error } = await addToFavorites(user.id, billboardData.id, billboardData.marker_id);

      if (!error) {
        setIsSaved(true);
        console.log("Billboard saved to favorites");
      } else {
        console.error("Failed to save favorite:", error.message);
      }
    } catch (err) {
      console.error("Error in saveToFavorites:", err);
    }
  };

  //  Contact Button
  const contactOnWhatsApp = () => {
    console.log("WA clicked");
    if (!billboardData?.phone_no) return;
    const url = `https://wa.me/${billboardData.phone_no
      }?text=${encodeURIComponent("Hello! I'm interested in your services.")}`;
    Linking.openURL(url);
  };

  // Open Website
  const openWebsite = () => {
    console.log("clicked web");
    if (billboardData?.web_url) {
      Linking.openURL(billboardData.web_url);
    }
  };

  if (!targetsLoaded) return null;

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" intensity={200} />

      <ViroARImageMarker
        target="logoMarker"
        onAnchorFound={() => {
          console.log('billboard detected')
          setMarkerVisible(true);
          fetchBillboard();
        }}
        onAnchorRemoved={() => {
          setMarkerVisible(false);
        }}
      >
        {markerVisible && billboardData && (
          <>
            <ViroText
              text={billboardData.title}
              position={[0.2, -0.8, -0.4]}
              scale={[0.4, 0.4, 0.4]}
              rotation={[-89, -3, 0]}
              style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}
            />

            {/* Coupons Pop-up */}
            {coupons.length > 0 && (
              <ViroText
                text={isClaimed ? "✓ Offer Saved!" : `🎁 ${coupons[0].discount_amount} OFF! Click to Save`}
                position={[0.2, -1.2, -0.4]}
                scale={[0.3, 0.3, 0.3]}
                rotation={[-89, -3, 0]}
                style={{ fontSize: 14, color: isClaimed ? "#28a745" : "#ff4757", fontWeight: "bold" }}
                onClick={handleClaimARCoupon}
              />
            )}

            <ViroText
              text="Website"
              position={[0.7, -1.99, -0.5]}
              scale={[0.41, 0.41, 0.41]}
              rotation={[-90, 0, 0]}
              style={{ fontSize: 22, color: "#007BFF" }}
              onClick={openWebsite}
            />
            <ViroText
              text="WhatsApp"
              position={[0.2, -1.99, -0.5]}
              scale={[0.4, 0.4, 0.4]}
              rotation={[-90, 0, 0]}
              style={{ fontSize: 22, color: "#25D366" }}
              onClick={contactOnWhatsApp}
            />

            {/* saved button */}
            <ViroText
              text={isSaved ? "✓ Saved" : "Save to Favorites"}
              position={[0.2, -1.9, -1.03]}
              scale={[0.5, 0.5, 0.5]}
              rotation={[-90, 0, 0]}
              style={{
                fontSize: 22,
                color: isSaved ? "#28a745" : "#000",
                fontWeight: "bold",
                textAlign: "center",
              }}
              onClick={() => {
                console.log('saved')
                if (!isSaved) saveToFavorites();
              }}
            />
          </>
        )}
      </ViroARImageMarker>
    </ViroARScene>
  );
}
