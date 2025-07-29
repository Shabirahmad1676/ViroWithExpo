import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GeoARMessage {
  id: string;
  latitude: number;
  longitude: number;
  message: string;
  imageUri?: string;
}

export function useGeoARMessages() {
  const [geoMessages, setGeoMessages] = useState<GeoARMessage[]>([]);
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("geoARMessages");
      if (stored) setGeoMessages(JSON.parse(stored));
    })();
  }, []);
  return geoMessages;
}
