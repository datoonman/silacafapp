import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Food = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CreateFood")}
      >
        <Text style={styles.buttonText}>Create a Food Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CheckFood")}
      >
        <Text style={styles.buttonText}>Check a Food Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 100,
    backgroundColor: "blue",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 24,
    color: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#005F88",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Food;
