import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARImageMarker,
  ViroAmbientLight,
  ViroARTrackingTargets,
  ViroText,
} from "@reactvision/react-viro";
import { Linking } from "react-native";
import { supabase } from "../utils/supabase";

export default function MarkerScene() {
  const [markerVisible, setMarkerVisible] = useState(false);
  const [targetsLoaded, setTargetsLoaded] = useState(false);
  const [billboardData, setBillboardData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

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

  //   Fetch billboard data when marker is found from supabase
  const fetchBillboard = async () => {
    const { data, error } = await supabase
      .from("billboards")
      .select("*")
      .eq("marker_id", "logoMarker")
      .single();

    if (error) {
      console.error("Error fetching billboard:", error.message);
    } else {
      setBillboardData(data);
      checkIfSaved(data.marker_id);
      console.log(" Billboard loaded:", data);
    }``
  };

  const checkIfSaved = async (markerId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    // .eq("user_id", userId)
    .eq("marker_id", markerId)
    .single();

  if (data) setIsSaved(true);
};


  // checkIfSaved(session.user.id, data.marker_id);



  const saveToFavorites = async () => {
    // if (!session?.user?.id || !billboardData) return;

    const { error } = await supabase.from("favorites").insert([
      {
        // user_id: session.user.id, //it is for Auth users , now i am doing without auth
        marker_id: billboardData.marker_id,
      },
    ]);

    if (!error) {
      setIsSaved(true);
      console.log(" Billboard saved to favorites");
    } else {
      console.error(" Failed to save favorite:", error.message);
    }
  };

  //  Contact Button
  const contactOnWhatsApp = () => {
    console.log("WA clicked");
    if (!billboardData?.phone_no) return;
    const url = `https://wa.me/${
      billboardData.phone_no
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
            {/* <ViroText
              text={billboardData.description}
              position={[0, -0.3, -1]}
              scale={[0.15, 0.15, 0.15]}
              rotation={[-90, 0, 0]}
              style={{ fontSize: 12, color: "#333" }}
            />  */}
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
              text={isSaved ? " Saved" : "Save to Favorites"}
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
