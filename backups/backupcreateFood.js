// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   FlatList,
// } from "react-native";
// import { db, fieldValue, storage } from "./firebase";

// const CreateFood = ({ navigation }) => {
//   const [foodName, setFoodName] = useState("");
//   const [foodDescription, setFoodDescription] = useState("");
//   const [foodCategory, setFoodCategory] = useState("");
//   const [foodCalories, setFoodCalories] = useState(0);
//   const [foodPrice, setFoodPrice] = useState(0);
//   const [caloriesError, setCaloriesError] = useState("");
//   const [priceError, setPriceError] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);

//   // Fetch categories from Firestore on component mount
//   useEffect(() => {
//     const unsubscribe = db.collection("category").onSnapshot((snapshot) => {
//       const categoryData = snapshot.docs.map((doc) => {
//         return {
//           id: doc.id,
//           ...doc.data(),
//         };
//       });
//       setCategories(categoryData);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Function to handle food creation
//   const handleFoodCreate = async () => {
//     if (
//       foodName.trim() === "" ||
//       foodDescription.trim() === "" ||
//       foodCategory === "" ||
//       foodCalories === 0 ||
//       foodPrice === 0
//     ) {
//       return;
//     }

//     if (isNaN(foodCalories)) {
//       setCaloriesError("Invalid input, please use only numbers");
//       return;
//     } else {
//       setCaloriesError("");
//     }

//     if (isNaN(foodPrice)) {
//       setPriceError("Invalid input, please use only numbers");
//       return;
//     } else {
//       setPriceError("");
//     }

//     // Create food document in Firestore
//     db.collection("food")
//       .add({
//         foodName,
//         foodDescription,
//         foodCategory,
//         foodCalories: parseInt(foodCalories),
//         foodPrice: parseInt(foodPrice),
//       })
//       .then(() => {
//         setFoodName("");
//         setFoodDescription("");
//         setFoodCategory("");
//         setFoodCalories(0);
//         setFoodPrice(0);
//       })
//       .catch((error) => {
//         console.log("Error creating food:", error);
//       });
//   };

//   // Function to handle category selection
//   const handleCategorySelect = (category) => {
//     setFoodCategory(category);
//     setShowCategoryModal(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={styles.backButtonText}>Back</Text>
//       </TouchableOpacity>
//       <Text style={styles.heading}>Create Food</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Food Name"
//         value={foodName}
//         onChangeText={(text) => setFoodName(text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         value={foodDescription}
//         onChangeText={(text) => setFoodDescription(text)}
//       />
//       <TouchableOpacity
//         style={styles.categoryInput}
//         onPress={() => setShowCategoryModal(true)}
//       >
//         <Text style={styles.categoryInputText}>
//           {foodCategory === "" ? "Select food category" : foodCategory}
//         </Text>
//       </TouchableOpacity>
//       {showCategoryModal && (
//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={showCategoryModal}
//         >
//           <View style={styles.modalContainer}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => setShowCategoryModal(false)}
//             >
//               <Text style={styles.backButtonText}>Close</Text>
//             </TouchableOpacity>
//             <FlatList
//               data={categories}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.categoryItem}
//                   onPress={() => handleCategorySelect(item.categoryName)}
//                 >
//                   <Text style={styles.categoryItemText}>
//                     {item.categoryName}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               keyExtractor={(item) => item.id}
//             />
//           </View>
//         </Modal>
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Calories"
//         value={foodCalories.toString()}
//         keyboardType="numeric"
//         onChangeText={(text) => setFoodCalories(text)}
//       />
//       {caloriesError !== "" && (
//         <Text style={styles.errorText}>{caloriesError}</Text>
//       )}
//       <TextInput
//         style={styles.input}
//         placeholder="Price"
//         value={foodPrice.toString()}
//         keyboardType="numeric"
//         onChangeText={(text) => setFoodPrice(text)}
//       />
//       {priceError !== "" && <Text style={styles.errorText}>{priceError}</Text>}
//       <TouchableOpacity style={styles.addButton} onPress={handleFoodCreate}>
//         <Text style={styles.addButtonText}>Create</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#FFF",
//   },
//   backButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "blue",
//     padding: 10,
//     borderRadius: 5,
//   },
//   backButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 15,
//   },
//   categoryInput: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     justifyContent: "center",
//   },
//   categoryInputText: {
//     fontSize: 16,
//   },
//   addButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   modalHeading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   categoryItem: {
//     paddingVertical: 10,
//     borderBottomColor: "#ccc",
//     borderBottomWidth: 1,
//   },
//   categoryItemText: {
//     fontSize: 18,
//   },
// });

// export default CreateFood;