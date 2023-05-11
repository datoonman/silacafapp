import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

function Cafeteria({ route }) {
  const navigation = useNavigation();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Cafeteria Panel</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Food")}
        >
          <Ionicons name="fast-food" size={24} color="#0074D9" />
          <Text style={styles.menuItemText}>Manage Food Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Category")}
        >
          <Ionicons name="list" size={24} color="#0074D9" />
          <Text style={styles.menuItemText}>Manage Food Category</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ViewFeedbacks")}
        >
          <Ionicons name="chatbox" size={24} color="#0074D9" />
          <Text style={styles.menuItemText}>View Feedbacks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("GenerateReport")}
        >
          <Ionicons name="document-text" size={24} color="#0074D9" />
          <Text style={styles.menuItemText}>Generate Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out" size={24} color="#FF4136" />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>
            Are you sure you want to logout?
          </Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#FF4136" }]}
              onPress={handleLogout}
            >
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0074D9",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalHeading: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#0074D9",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default Cafeteria;
