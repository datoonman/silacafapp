import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const About = ({ navigation }) => {
  return (
    <View style={styles.container}>

    <View style={styles.container}>
    <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>About Cafeteria Companion</Text>
      <Text style={styles.text}>
      Smartphones have become an indispensable instrument for numerous individuals worldwide, granting access to diverse communication options, information, processes, and services. In Saraburi, Thailand, Asia-Pacific International University, a private Christian institution, faces the challenge of efficiently managing its cafeteria services while ensuring high-quality food for its students. 
      </Text>
      <Text style={styles.text}>
      Presently, the university cafeteria lacks an efficient means for students to access daily menu information, making meal planning arduous. Additionally, the absence of a feedback system for users further compounds the issue. However, the proposed solution involves developing a mobile application that addresses both challenges. 
      </Text>
      <Text style={styles.text}>
      The implementation of this application will improve the food services at Asia-Pacific International University by facilitating two-way communication between customers and cafeteria management. 
      </Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
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

export default About;
