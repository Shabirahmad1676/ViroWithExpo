import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "AR_IMAGE_MESSAGE";

export function useAsyncMessage() {
  const [placedMessage, setPlacedMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((msg) => {
      if (msg) setPlacedMessage(msg);
      setLoading(false);
    });
  }, []);

  const saveMessage = async (msg: string) => {
    setPlacedMessage(msg);
    await AsyncStorage.setItem(STORAGE_KEY, msg);
  };

  return { placedMessage, saveMessage, loading };
}
