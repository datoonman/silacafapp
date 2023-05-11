import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { format, addDays, startOfWeek } from "date-fns";
import { db } from "./firebase";
import Toast from 'react-native-toast-message';
import { color } from "react-native-elements/dist/helpers";

function CalendarScreen({ userData,navigation}) {
  const [selectedDay, setSelectedDay] = useState(0); // Initially set the selected day to 0 (Sunday)
  const [foodData, setFoodData] = useState([]); // State to store the fetched food data

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Array of days of the week
  const today = new Date();
  const todayText = `Today's date is ${format(today, "EEEE, MMMM d, yyyy")}`;

  const handleDayClick = (day) => {
    setSelectedDay(day); // Update the selected day when a button is clicked
    fetchFoodData(day); // Fetch the food data for the selected day
  };

  const fetchFoodData = async (day) => {
    try {
      const foodRef = db.collection("food");
      const selectedDate = format(
        addDays(startOfWeek(today), day),
        "yyyy-MM-dd"
      );
      const querySnapshot = await foodRef
        .where("daySchedule", "array-contains", { date: selectedDate })
        .get();
      const data = querySnapshot.docs.map((doc) => doc.data());
      setFoodData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFoodData(selectedDay);
  }, [selectedDay]);

  const handleFoodCardPress = async (foodItem) => {
    try {
      const selectedDate = format(
        addDays(startOfWeek(today), selectedDay),
        "yyyy-MM-dd"
      );
  
      // Generate the secret name
      const nameParts = [
        userData.name.split("").reverse().join(""),
        foodItem.foodName.split("").reverse().join("").substring(0, 6) || foodItem.foodName.split("").reverse().join(""),
        selectedDate.split("").reverse().join("").slice(0, 1),
      ];
      const docName = nameParts.map(part => part.replace(/\s/g, '-')).join("-");
      const foodRef = db.collection("scheduleDate").doc(docName);
      const foodDoc = await foodRef.get();
  
      if (foodDoc.exists && foodDoc.data().foodName === foodItem.foodName) {
        await foodRef.delete();
        console.log("Food item removed from Firestore");
        Toast.show({
          type: 'info',
          text1: 'Removed from Wishlist',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
  
        // Decrement demand rating by 1
        const foodQuery = db.collection("food").where("foodName", "==", foodItem.foodName).limit(1);
        const foodSnapshot = await foodQuery.get();
        const foodDocRef = foodSnapshot.docs[0].ref;
        await foodDocRef.update({
          demandRating: foodItem.demandRating - 1
        });
      } else {
        await foodRef.set({
          foodName: foodItem.foodName,
          name: userData.name,
          date: selectedDate,
        });
        console.log("Food item saved to Firestore");
        Toast.show({
          type: 'success',
          text1: 'Food item saved to Firestore',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
  
        // Increment demand rating by 1
        const foodQuery = db.collection("food").where("foodName", "==", foodItem.foodName).limit(1);
        const foodSnapshot = await foodQuery.get();
        const foodDocRef = foodSnapshot.docs[0].ref;
        await foodDocRef.update({
          demandRating: foodItem.demandRating + 1
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{todayText}</Text>
      <View style={styles.buttonContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              selectedDay === index && styles.selectedButton,
              format(addDays(startOfWeek(today), index), "yyyy-MM-dd") ===
                format(today, "yyyy-MM-dd") && styles.currentDayButton, // Highlight the current day
            ]}
            onPress={() => handleDayClick(index)}
          >
            <Text style={styles.buttonText}>{day}</Text>
            <Text style={styles.dateText}>
              {format(addDays(startOfWeek(new Date()), index), "d")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.header}>Expected Food</Text>
      <FlatList
        data={foodData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodCard}
            onPress={() => handleFoodCardPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: item.foodImage }}
                style={{ width: 150, height: 150 }}
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={styles.foodName}>{item.foodName}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.foodRating}>Price: ฿{item.foodPrice}</Text>
              </View>
              <Text style={styles.foodDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.foodListContainer}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
      />
            <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "3%",
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#008B9C",
  },
  currentDayButton: {
    backgroundColor: "#14345C",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  foodListContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: "1%",
    alignItems: "center",
  },
  foodCard: {
    width: 150,
    height: 200,
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#005F88",
    marginBottom: 5,
  },
  foodRating: {
    fontSize: 12,
    color: "#808080",
    marginRight: 5,
  },
  foodDescription: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CalendarScreen;
