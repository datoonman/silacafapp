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
  Picker,
  Image,
  Modal,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const SearchScreen = ({ route, navigation}) => {
  const [searchKeywords, setSearchKeywords] = useState("");
  const [food, setFood] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodDescription, setFoodDescription] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const userData = route.params.userData;

  const filteredUsers = food.filter((food) => {
    return (
      food.foodName.toLowerCase().includes(searchKeywords.toLowerCase()) ||
      food.foodDescription.toLowerCase().includes(searchKeywords.toLowerCase())
    );
  });

  useEffect(() => {
    const today = new Date().toISOString().substr(0, 10);
    let unsubscribe;
  
  
    const fetchData = async () => {
      try {
        const querySnapshot = await db.collection("food")
          .where("daySchedule", "array-contains", { date: today })
          .get();
    
        setFood(querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })));
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };
    
  

  fetchData();
  return () => {
    unsubscribe && unsubscribe();
  };
}, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    console.log(`Selected category: ${category.categoryName}`);
  };

  const handleFoodCardPress = (foodItem) => {
    setSelectedFoodItem(foodItem);
    setModalVisible(true);
  };  

  const handleLikeItem = async (foodName) => {
    try {
      const usersRef = db.collection("users");
      const querySnapshot = await usersRef
        .where("name", "==", userData.name)
        .get();
      if (querySnapshot.empty) {
        console.log(`User ${userData.name} does not exist.`);
        return;
      }
      const userDoc = querySnapshot.docs[0];
      const likeItems = userDoc.get("likeItems") || [];
      if (likeItems.includes(foodName)) {
        const updatedLikeItems = likeItems.filter((item) => item !== foodName);
        await userDoc.ref.update({ likeItems: updatedLikeItems });
        console.log(`${foodName} has been removed from the likeItems array.`);
        const foodQuerySnapshot = await db
          .collection("food")
          .where("foodName", "==", foodName)
          .get();
        if (!foodQuerySnapshot.empty) {
          const foodDoc = foodQuerySnapshot.docs[0];
          const rating = foodDoc.get("rating") || 0;
          await foodDoc.ref.update({ rating: rating - 1 });
          console.log(`Rating of ${foodName} has been decremented.`);
        }
        setIsLiked(false);
      } else {
        const updatedLikeItems = [...likeItems, foodName];
        await userDoc.ref.update({ likeItems: updatedLikeItems });
        console.log(`${foodName} has been added to the likeItems array.`);
        const foodQuerySnapshot = await db
          .collection("food")
          .where("foodName", "==", foodName)
          .get();
        if (!foodQuerySnapshot.empty) {
          const foodDoc = foodQuerySnapshot.docs[0];
          const rating = foodDoc.get("rating") || 0;
          await foodDoc.ref.update({ rating: rating + 1 });
          console.log(`Rating of ${foodName} has been incremented.`);
        }
        setIsLiked(true);
      }
    } catch (error) {
      console.error(`Error adding ${foodName} to the likeItems array:`, error);
    }
  };

  const handleFavouriteItem = async (foodName) => {
    try {
      const usersRef = db.collection("users");
      const querySnapshot = await usersRef
        .where("name", "==", userData.name)
        .get();
      if (querySnapshot.empty) {
        console.log(`User ${userData.name} does not exist.`);
        return;
      }
      const userDoc = querySnapshot.docs[0];
      const favouriteItems = userDoc.get("favouriteItems") || [];
      if (favouriteItems.includes(foodName)) {
        const updatedFavouriteItems = favouriteItems.filter(
          (item) => item !== foodName
        );
        await userDoc.ref.update({ favouriteItems: updatedFavouriteItems });
        console.log(
          `${foodName} has been removed from the favouriteItems array.`
        );
        const foodQuerySnapshot = await db
          .collection("food")
          .where("foodName", "==", foodName)
          .get();
        if (!foodQuerySnapshot.empty) {
          const foodDoc = foodQuerySnapshot.docs[0];
          const favouriteRating = foodDoc.get("favouriteRating") || 0;
          await foodDoc.ref.update({ favouriteRating: favouriteRating - 1 });
          console.log(`favouriteRating of ${foodName} has been decremented.`);
        }
        setFavouriteRating((prevRating) => prevRating - 1);
        setIsFavourite(false);
      } else {
        const updatedFavouriteItems = [...favouriteItems, foodName];
        await userDoc.ref.update({ favouriteItems: updatedFavouriteItems });
        console.log(`${foodName} has been added to the favouriteItems array.`);
        const foodQuerySnapshot = await db
          .collection("food")
          .where("foodName", "==", foodName)
          .get();
        if (!foodQuerySnapshot.empty) {
          const foodDoc = foodQuerySnapshot.docs[0];
          const favouriteRating = foodDoc.get("favouriteRating") || 0;
          await foodDoc.ref.update({ favouriteRating: favouriteRating + 1 });
          console.log(`favouriteRating of ${foodName} has been incremented.`);
        }
        setFavouriteRating((prevRating) => prevRating + 1);
        setIsFavourite(true);
      }
    } catch (error) {
      console.error(
        `Error adding ${foodName} to the favouriteItems array:`,
        error
      );
    }
  };

  const handleSave = () => {
    db.collection("food").doc(selectedFood.id).update({
      foodName: selectedFood.foodName,
      foodDescription: foodDescription,
      foodCalories: foodCalories,
      foodPrice: foodPrice,
      foodCategory: foodCategory,
    });
    setSelectedFood(null);
    setFoodDescription("");
    setFoodCalories("");
    setFoodPrice("");
    setFoodCategory("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Search for Food!</Text>
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
            <TouchableOpacity
              style={styles.foodCard}
              onPress={() => handleFoodCardPress(item)}
              key={item.id}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.foodImage }}
                  style={{ width: 150, height: 150 }}
                  resizeMode="cover"
                />
                <Text style={styles.foodName}>{item.foodName}</Text>
                <Text style={styles.foodRating}>Price: ฿{item.foodPrice}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={{ flex: 1 }}
          contentContainerStyle={{ marginHorizontal: "0.5%" }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        onShow={async () => {
          try {
            const usersRef = db.collection("users");
            const querySnapshot = await usersRef
              .where("name", "==", userData.name)
              .get();
            if (querySnapshot.empty) {
              console.log(`User ${userData.name} does not exist.`);
              setIsLiked(false);
              setIsFavourite(false);
              return;
            }
            const userDoc = querySnapshot.docs[0];
            const likeItems = userDoc.get("likeItems") || [];
            const liked =
              likeItems.includes(selectedFoodItem?.foodName) || false;
            setIsLiked(liked);
            const favItems = userDoc.get("favouriteItems") || [];
            const favorited =
              favItems.includes(selectedFoodItem?.foodName) || false;
            setIsFavourite(favorited);
          } catch (error) {
            console.error(
              `Error checking if ${selectedFoodItem?.foodName} is liked:`,
              error
            );
            setIsLiked(false);
            setIsFavourite(false);
          }
        }}
        
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedFoodItem?.foodName}</Text>
            <Image
              source={{ uri: selectedFoodItem?.foodImage }}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.modalText}>
              Food Category: {selectedFoodItem?.foodCategory}
            </Text>
            <Text style={styles.modalDescription}>
              Description: {selectedFoodItem?.foodDescription}
            </Text>
            <Text style={styles.modalText}>
              Calories: {selectedFoodItem?.foodCalories}
            </Text>
            <Text style={styles.modalText}>
              Price: ฿{selectedFoodItem?.foodPrice}
            </Text>
            <Text style={styles.modalText}>
              {selectedFoodItem?.rating === 0
                ? "Be the first to rate it!"
                : `"${selectedFoodItem?.rating}" People liked this menu!`}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleLikeItem(selectedFoodItem?.foodName)}
              >
                <AntDesign
                  name="heart"
                  size={24}
                  color={isLiked ? "red" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleFavouriteItem(selectedFoodItem?.foodName)}
              >
                <FontAwesome
                  name="star"
                  size={24}
                  color={isFavourite ? "#FFDB58" : "black"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: "3%",
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#F3F3F3",
    padding: 10,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  modalButtonClose: {
    backgroundColor: "#005F88",
    width: "30%",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  foodRating: {
    fontSize: 12,
    color: "#808080",
    marginRight: 5,
  },
});

export default SearchScreen;
