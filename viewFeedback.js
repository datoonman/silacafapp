import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  Picker,
} from "react-native";
import { db } from "./firebase";

const ViewFeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    // Fetch feedback data from Firestore collection
    db.collection("feedback")
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            topic: doc.data().topic,
            content: doc.data().content,
            date: doc.data().date,
            rating: doc.data().rating,
          });
        });
        setFeedback(data);
        setFilteredFeedback(data);
      });
  }, []);

  const renderFeedbackItem = ({ item }) => {
    return (
      <View style={styles.feedbackItem}>
        <Text><Text style={styles.topic}>{item.topic}</Text> {item.date} | Rating: {item.rating}/5</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    );
  };

  useEffect(() => {
    const filteredData = feedback.filter((item) => {
      const matchesFilter =
        selectedFilter === "" || item.topic === selectedFilter;
      return matchesFilter;
    });
    setFilteredFeedback(filteredData);
  }, [selectedFilter, feedback]);
  

  const handleFilterChange = (text) => {
    setFilterText(text);
    const filteredData = feedback.filter((item) => {
      const matchesTopic = item.topic.toLowerCase().includes(text.toLowerCase());
      const matchesFilter =
        selectedFilter === "" || item.topic === selectedFilter;
      return matchesTopic && matchesFilter;
    });
    setFilteredFeedback(filteredData);
  };
  

  const filterOptions = [
    { label: "All", value: "" },
    { label: "Cleanliness", value: "Cleanliness" },
    { label: "Food", value: "Food" },
    { label: "Temperature", value: "Temperature" },
    { label: "Noise", value: "Noise" },
    { label: "Staff", value: "Staff" },
    { label: "Other", value: "Other" },
  ];
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>View Feedback</Text>
      <View style={styles.filterContainer}>
  <Picker
    selectedValue={selectedFilter}
    onValueChange={(itemValue, itemIndex) => setSelectedFilter(itemValue)}
    style={styles.filterPicker}
  >
    {filterOptions.map((option) => (
      <Picker.Item
        key={option.value}
        label={option.label}
        value={option.value}
      />
    ))}
  </Picker>
</View>
      <FlatList
        data={filteredFeedback}
        renderItem={renderFeedbackItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  feedbackItem: {
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
  },
  topic: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  filterButton: {
    marginLeft: 10,
    borderRadius: 5,
  },
});

export default ViewFeedbackScreen;