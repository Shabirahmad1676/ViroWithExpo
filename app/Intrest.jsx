import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { supabase } from "../utils/supabase";

const interests = [
  "Offers", "Foods", "Clothes", "Brands", "Beauty",
  "Travel", "Tech", "Fitness", "Books", "Music",
];

export default function InterestSelector() {
  const [selected, setSelected] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Auth error:", error);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const toggleInterest = (item) => {
   setSelected((prev)=>prev.includes(item) ? prev.filter((i)=>i!==item) : [...prev,item])
  };

 useEffect(() => {
  const fetchData = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_interests')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      console.log('Fetch error:', error);
    } else {
        setSelected(data[0]?.interests || []);
    }
  };
  fetchData();
}, [user]);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Not logged in", "Please log in to submit interests.");
      return;
    }

    const { error } = await supabase
      .from("user_interests")
      .upsert([
        {
          user_id: user.id,
          interests: selected,
        },
      ]);

    if (error) {
      console.error("Insert failed:", error);
      Alert.alert("Error", "Failed to submit interests.");
    } else {
      Alert.alert("Success", "Your interests have been saved!");
    //   setSelected([]);
    }
  };

  async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    Alert.alert("Error", "Failed to log out.");
  } else {
    Alert.alert("Logged out", "You have been logged out.");
  }
}

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {interests.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => toggleInterest(item)}
            >
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

     <View style={{flexDirection:'row',gap:10,justifyContent:'center'}}>
         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit +</Text>
      </TouchableOpacity>
       <TouchableOpacity style={styles.submitButton} onPress={signOut}>
        <Text style={styles.submitText}>LogOut</Text>
      </TouchableOpacity>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 40,
  },
  button: {
    margin: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    elevation: 2,
  },
  buttonSelected: {
    backgroundColor: "#2196f3",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonTextSelected: {
    color: "#fff",
  },
  submitButton: {
    marginBottom:10,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
