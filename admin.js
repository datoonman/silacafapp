import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
  Picker,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "./firebase";

const Admin = ({ route }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [searchKeywords, setSearchKeywords] = useState("");
  const navigation = useNavigation();

  const roles = ["customer", "cafeteria", "admin"];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  // Fetch users from Firestore on component mount
  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
      const userData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          name: doc.data().name,
          preferred_username: doc.data().preferred_username,
          role: doc.data().role,
        };
      });
      setUsers(userData);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle user selection
  const handleUserSelect = (user) => {
    // handle user selection
  };

  const handleRoleChange = (userId, itemValue) => {
    // update the user role in Firestore
    db.collection("users")
      .doc(userId)
      .update({
        role: itemValue,
      })
      .then(() => {
        console.log("Role updated successfully");
        setSelectedUserRole("");
      })
      .catch((error) => {
        console.error("Error updating role: ", error);
      });
  };

  // Function to filter users based on search keywords
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchKeywords.toLowerCase()) ||
      user.preferred_username
        .toLowerCase()
        .includes(searchKeywords.toLowerCase())
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>List of Users</Text>
      <TextInput
        style={styles.searchButton}
        placeholder="Search users"
        value={searchKeywords}
        onChangeText={(text) => setSearchKeywords(text)}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.userItem}
            onPress={() => handleUserSelect(item)}
          >
            <Text style={styles.userItemText}>{item.name}</Text>
            <View style={styles.userItemRoleContainer}>
              <Text style={styles.userItemRole}>{item.role}</Text>
              <Picker
                selectedValue={selectedUserRole}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedUserRole(itemValue);
                  handleRoleChange(item.id, itemValue);
                }}
                mode="dropdown"
                enabled={true}
              >
                <Picker.Item label="Select role" value="" />
                {roles.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Logout" onPress={handleLogout} color="#FF4136" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "Black",
  },

  searchButtonText: {
    color: "white",
    fontSize: 16,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userItemText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userItemRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userItemRole: {
    fontSize: 16,
    marginRight: 10,
    flex: 1,
  },
});

export default Admin;
