import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  CheckBox,
  Picker,
  Platform,
} from "react-native";
import { db, fieldValue, storage } from "./firebase";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-toast-message";

const CreateFood = ({ navigation }) => {
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [caloriesError, setCaloriesError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [timeschedule, setTimeschedule] = useState("");
  const [selectedDates, setSelectedDates] = useState({});

  // Fetch categories from Firestore on component mount
  useEffect(() => {
    const unsubscribe = db.collection("category").onSnapshot((snapshot) => {
      const categoryData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCategories(categoryData);
    });

    return () => unsubscribe();
  }, []);

  const handleFoodCreate = async () => {
    if (
      foodName.trim() === "" ||
      foodDescription.trim() === "" ||
      foodCategory === "" ||
      foodCalories === "" ||
      foodPrice === "" ||
      !imageUri
    ) {
      return;
    }

    if (isNaN(foodCalories)) {
      setCaloriesError("Invalid input, please use only numbers");
      return;
    } else {
      setCaloriesError("");
    }

    if (isNaN(foodPrice)) {
      setPriceError("Invalid input, please use only numbers");
      return;
    } else {
      setPriceError("");
    }

    const imageUrl = await handleImageUpload();

    // Get an array of selected dates
    const selectedDateArray = Object.keys(selectedDates);

    // Map the array to create an array of objects with date property
    const scheduleDates = selectedDateArray.map((date) => {
      return {
        date,
        // Add any additional properties you want to save for each date
      };
    });

    // Create food document in Firestore
    db.collection("food")
      .add({
        foodName,
        foodDescription,
        foodCategory,
        foodCalories: parseInt(foodCalories),
        foodPrice: parseInt(foodPrice),
        foodImage: imageUrl,
        timeschedule,
        rating: 0,
        favouriteRating: 0,
        demandRating: 0,
        daySchedule: scheduleDates,
      })
      .then(() => {
        setFoodName("");
        setFoodDescription("");
        setFoodCategory("");
        setFoodCalories("");
        setFoodPrice("");
        setImageUri(null);
        setSelectedDates([]);

        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      })      
      .catch((error) => {
        console.log("Error creating food:", error);
        // alert("Food Created!");
        Toast.show({
          type: "success",
          text1: "Food Successfully Created",
        });        
      });
  };

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setFoodCategory(category);
    setShowCategoryModal(false);
  };

  const handleImageUpload = async () => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageName = new Date().getTime().toString();
    const ref = storage.ref().child(`foodImages/${imageName}`);
    await ref.put(blob);
    const imageUrl = await ref.getDownloadURL();
    return imageUrl;
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImageUri(result.uri);
        // alert("Your Picture is Ready to Be Upload!");
        Toast.show({
          type: "success",
          text1: "Picture Attached!",
        });      
      }
    }
  };

  const buttonText = imageUri ? 'Picture Attached!' : 'Pick an Image';

  const handleDayPress = (day) => {
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[day.dateString]) {
      // The date is already selected, so deselect it
      delete newSelectedDates[day.dateString];
    } else {
      // The date is not selected, so add it
      newSelectedDates[day.dateString] = { selected: true };
    }
    setSelectedDates(newSelectedDates);
  };

  function clearDates() {
    const dates = document.querySelectorAll(".date-input:checked");
    dates.forEach((date) => (date.checked = false));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Create Food</Text>
      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={foodName}
        onChangeText={(text) => setFoodName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={foodDescription}
        onChangeText={(text) => setFoodDescription(text)}
      />
      <TouchableOpacity
        style={styles.categoryInput}
        onPress={() => setShowCategoryModal(true)}
      >
        <Text style={styles.categoryInputText}>
          {foodCategory === "" ? "Select food category" : foodCategory}
        </Text>
      </TouchableOpacity>
      {showCategoryModal && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showCategoryModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.backButtonText}>Close</Text>
            </TouchableOpacity>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect(item.categoryName)}
                >
                  <Text style={styles.categoryItemText}>
                    {item.categoryName}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </Modal>
      )}

      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={foodCalories.toString()}
        keyboardType="numeric"
        onChangeText={(number) => setFoodCalories(number)}
      />
      {caloriesError !== "" && (
        <Text style={styles.errorText}>{caloriesError}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={foodPrice.toString()}
        keyboardType="numeric"
        onChangeText={(number) => setFoodPrice(number)}
      />
      {priceError !== "" && <Text style={styles.errorText}>{priceError}</Text>}

      <Text style={styles.specialsubheading}>Available Days:</Text>
      <Calendar onDayPress={handleDayPress} markedDates={selectedDates} />

      <View style={styles.timescheduleContainer}>
        <Text style={styles.specialsubheading}>Available Times:</Text>
        <FlatList
          data={[
            { time: "Breakfast", checked: timeschedule.includes("Breakfast") },
            { time: "Lunch", checked: timeschedule.includes("Lunch") },
            { time: "Dinner", checked: timeschedule.includes("Dinner") },
          ]}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.dayContainer}>
              <CheckBox
                value={item.checked}
                onValueChange={() => {
                  const updatedSchedule = [...timeschedule];
                  if (item.checked) {
                    updatedSchedule.splice(
                      updatedSchedule.indexOf(item.time),
                      1
                    );
                  } else {
                    updatedSchedule.push(item.time);
                  }
                  setTimeschedule(updatedSchedule);
                }}
              />
              <Text style={styles.dayText}>{item.time}</Text>
            </View>
          )}
          keyExtractor={(item) => item.time}
        />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>{buttonText}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleFoodCreate}>
        <Text style={styles.addButtonText}>Create</Text>
      </TouchableOpacity>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  specialsubheading: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  categoryInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  categoryInputText: {
    color: "#666",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  categoryItemText: {
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#eee",
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  timeScheduleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  timeScheduleText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dayText: {
    marginHorizontal: 5,
    fontSize: 16,
  },
  days: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});

export default CreateFood;