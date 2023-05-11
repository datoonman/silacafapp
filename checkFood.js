import { db } from "./firebase";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  Picker,
  CheckBox,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-web";

const CheckFood = ({ navigation }) => {
  const [searchKeywords, setSearchKeywords] = useState("");
  const [food, setFood] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodDescription, setFoodDescription] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeschedule, setTimeschedule] = useState("");
  const [selectedTimeSchedule, setSelectedTimeSchedule] = useState([]);

  const timeScheduleOptions = ["Breakfast", "Lunch", "Dinner"];

  const filteredUsers = food.filter((food) => {
    return (
      food.foodName.toLowerCase().includes(searchKeywords.toLowerCase()) ||
      food.foodDescription.toLowerCase().includes(searchKeywords.toLowerCase())
    );
  });
  useEffect(() => {
    const unsubscribe = db.collection("food").onSnapshot((snapshot) => {
      setFood(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection("category").onSnapshot((snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  const handleDelete = (id) => {
    db.collection("food").doc(id).delete();
  };

  const handleOpenModal = (
    id,
    foodName,
    foodDescription,
    foodCalories,
    foodPrice,
    foodCategory
  ) => {
    setSelectedFood({
      id,
      foodName,
      foodDescription,
      foodCalories,
      foodPrice,
      foodCategory,
    });
    setFoodDescription(foodDescription);
    setFoodCalories(foodCalories);
    setFoodPrice(foodPrice);
    setFoodCategory(foodCategory); // set initial value of foodCategory
    setModalVisible(true);
  };
  const handleSave = () => {
    db.collection("food").doc(selectedFood.id).update({
      foodName: selectedFood.foodName,
      foodDescription: foodDescription,
      foodCalories: foodCalories,
      foodPrice: foodPrice,
      foodCategory: foodCategory,
      timeschedule: timeschedule,
    });
    setSelectedFood(null);
    setFoodDescription("");
    setFoodCalories("");
    setFoodPrice("");
    setFoodCategory("");
    setModalVisible(false);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setSelectedFood(null);
    setFoodDescription(""); // add this line
    setModalVisible(false);
  };

  const handleDayPress = (day) => {
    if (selectedDates.includes(day.dateString)) {
      // The date is already selected, so remove it from the list
      setSelectedDates(selectedDates.filter((date) => date !== day.dateString));
    } else {
      // The date is not selected, so add it to the list
      setSelectedDates([...selectedDates, day.dateString]);
    }
  };

  const handleRemoveDate = (date) => {
    setSelectedDates(selectedDates.filter((d) => d !== date));
  };

  // function clearDates() {
  //   const dates = document.querySelectorAll(".date-input:checked");
  //   dates.forEach((date) => (date.checked = false));
  // }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Food List</Text>
      <TextInput
        style={styles.searchButton}
        placeholder="Search Food"
        value={searchKeywords}
        onChangeText={(text) => setSearchKeywords(text)}
      />
      <View style={styles.foodListContainer}>
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.foodItem}>
              <Text style={styles.foodName}>{item.foodName}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  handleOpenModal(
                    item.id,
                    item.foodName,
                    item.foodDescription,
                    item.foodCalories,
                    item.foodPrice,
                    item.foodCategory,
                    item.foodtimeschedule
                  )
                }
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {selectedFood && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          {/* <ScrollView> */}
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Food Name"
                  value={selectedFood.foodName}
                  onChangeText={(text) =>
                    setSelectedFood({ ...selectedFood, foodName: text })
                  }
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Food Description" // add this line
                  value={foodDescription} // edit this line
                  onChangeText={(text) => setFoodDescription(text)} // edit this line
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Food Calories" // add this line
                  value={foodCalories} // edit this line
                  onChangeText={(number) => setFoodCalories(number)} // edit this line
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Food Price" // add this line
                  value={foodPrice} // edit this line
                  onChangeText={(number) => setFoodPrice(number)} // edit this line
                />
                <Picker
                  selectedValue={foodCategory}
                  onValueChange={(itemValue) => setFoodCategory(itemValue)}
                >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((category) => (
                    <Picker.Item
                      key={category.id}
                      label={category.categoryName}
                      value={category.categoryName}
                    />
                  ))}
                </Picker>

                {/* <Text style={styles.specialsubheading}>Available Days:</Text>
                <Calendar
                  onDayPress={(day) => handleDayPress(day)}
                  markedDates={filteredUsers.reduce((obj, food) => {
                    food.selectedDates.forEach((date) => {
                      obj[date] = { selected: true };
                    });
                    return obj;
                  }, {})}
                /> */}

                <View style={styles.dateListContainer}>
                  {selectedDates.map((date) => (
                    <View key={date} style={styles.dateItem}>
                      <Text style={styles.dateText}>{date}</Text>
                      <TouchableOpacity
                        style={styles.removeDateButton}
                        onPress={() => handleRemoveDate(date)}
                      >
                        <Text style={styles.removeDateButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.timescheduleContainer}>
                  <Text style={styles.specialsubheading}>Available Times:</Text>
                  {food.timeschedule && <Text>Current Times Available: {food.timeschedule}</Text>}
                  <FlatList
                    data={[
                      {
                        time: "Breakfast",
                        checked: timeschedule.includes("Breakfast"),
                      },
                      {
                        time: "Lunch",
                        checked: timeschedule.includes("Lunch"),
                      },
                      {
                        time: "Dinner",
                        checked: timeschedule.includes("Dinner"),
                      },
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
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={() => handleSave()}
                >
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => handleCloseModal()}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          {/* </ScrollView> */}
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  foodListContainer: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
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
  specialsubheading: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
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
    marginTop: 10,
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
  foodList: {
    flex: 1,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  foodName: {
    flex: 1,
    marginRight: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#FFA500",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 8,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalSaveButton: {
    width: "100%",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  modalSaveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalCancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "white",
    fontWeight: "bold",
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
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});

export default CheckFood;
