import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Button } from "react-native";

export default function BillboardDetails() {
  const { id, title, description } = useLocalSearchParams();
  const router = useRouter()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold" },
  desc: { fontSize: 16, marginTop: 10 },
});
