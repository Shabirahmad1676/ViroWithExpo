import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import BillBoardCard from "../../components/BillBoardCard";

export default function BillboardDetails() {
  const { id, title, description, image, contact, website, price, category } =
    useLocalSearchParams();

  const [imgLoading, setImgLoading] = useState(Boolean(image));
  const [imgError, setImgError] = useState(false);
  const[favorite,setFavorite] = useState(false)

  const openWhatsApp = async () => {
    if (!contact) {
      Alert.alert(
        "No contact number",
        "This billboard does not have a contact number."
      );
      return;
    }
    const digits = contact.replace(/\D/g, "");
    const waUrl = `https://wa.me/${digits}`;
    try {
      const supported = await Linking.canOpenURL(waUrl);
      if (!supported) {
        Alert.alert(
          "Unable to open WhatsApp",
          "WhatsApp may not be available on this device."
        );
        return;
      }
      await Linking.openURL(waUrl);
    } catch (err) {
      Alert.alert("Error", "Could not open WhatsApp.");
    }
  };

  const openWebsite = async () => {
    if (!website) {
      Alert.alert("No website", "No website link provided for this billboard.");
      return;
    }
    const url = website.startsWith("http") ? website : `https://${website}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Cannot open link", "No application can open this link.");
        return;
      }
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert("Error", "Could not open the website.");
    }
  };

  const handleFavorite = ()=>{
    setFavorite(!favorite)
    // console.log('added to favorite')
  }

  return (
    <View style={styles.container}>
      <BillBoardCard
        image={image}
        title={title}
        description={description}
        price={price}
        category={category}
        imgLoading={imgLoading}
        imgError={imgError}
        setImgLoading={setImgLoading}
        setImgError={setImgError}
      />


    <TouchableOpacity style={styles.favorite} onPress={handleFavorite}>
          { 
           favorite ? <FontAwesome name="heart" size={20} color="#fff" />
           :
          <AntDesign name="heart" size={20} color="red" />
          
          }
        </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.iconButton, styles.whatsapp]}
          onPress={openWhatsApp}
        >
          <FontAwesome name="whatsapp" size={22} color="#fff" />
          {/* <Text style={styles.buttonLabel}>Contact</Text> */}
        </TouchableOpacity>

        

        <TouchableOpacity
          style={[styles.iconButton, styles.link]}
          onPress={openWebsite}
        >
          <FontAwesome name="globe" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
  },
  favorite: {
  position:'absolute',
  top:141,
  // backgroundColor:'red',
  right:48
},
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    position:'relative',
    flexWrap: "wrap",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 33,
    borderRadius: 28,
    marginHorizontal: 6,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  whatsapp: {
    backgroundColor: "#25D366",
  },
  buy: {
    backgroundColor: "#4CAF50",
  },
  link: {
    backgroundColor: "#1976D2",
  },
  footerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
  },
  smallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  smallBtnText: {
    color: "#333",
    fontWeight: "600",
  },
});
