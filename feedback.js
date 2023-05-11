import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from "react-native";
import { db } from "./firebase";

const FeedbackScreen = ({ userData, navigation }) => {
  const [topic, setTopic] = useState("Cleanliness");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  const handleTopicChange = (value) => {
    setTopic(value);
  };

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    try {
      // Get the Firestore collection reference for feedbacks
      const feedbacksRef = db.collection("feedback");

      // Add the new feedback document with auto-incremented ID
      const newFeedbackRef = await feedbacksRef.add({
        topic: topic,
        content: content,
        rating: rating,
        date: formattedDate,
      });

      console.log("Feedback submitted with ID:", newFeedbackRef.id);

      // Clear the input fields
      setTopic("Cleanliness");
      setContent("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.starButton}
          onPress={() => handleRatingChange(i)}
        >
          <Text style={i <= rating ? styles.selectedStarText : styles.starText}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Submit your Feedbacks</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Topic:</Text>
      <Picker
        selectedValue={topic}
        onValueChange={handleTopicChange}
        style={styles.picker}
      >
        <Picker.Item label="Cleanliness" value="Cleanliness" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Temperature" value="Temperature" />
        <Picker.Item label="Noise" value="Noise" />
        <Picker.Item label="Staff" value="Staff" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      <Text style={styles.label}>Rating:</Text>
      <View style={styles.starContainer}>{renderStars()}</View>
      <Text style={styles.label}>Content:</Text>
      <TextInput
        value={content}
        onChangeText={handleContentChange}
        style={[styles.input, styles.multiline]}
        multiline={true}
        numberOfLines={4}
      />
      <Button title="Submit" onPress={handleSubmit} color="#008B9C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#005F88",
  },
  input: {
    borderWidth: 1,
    borderColor: "#005F88",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "#000",
  },
  multiline: {
    height: 100,
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#005F88",
    borderRadius: 5,
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  starButton: {
    marginHorizontal: 5,
  },
  starText: {
    fontSize: 35,
    color: "#D3D3D3",
  },




    selectedStarText: {
    fontSize: 35,
    color: "#FFD700",
    },
    heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#005F88",
    },
});

export default FeedbackScreen;
