// import React, { useState, useEffect, useRef } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
//   Button,
//   Image,
//   Modal,
//   Pressable,
// } from "react-native";
// import { db } from "../firebase";
// import { ScrollView } from "react-native-web";
// import { AntDesign, FontAwesome } from "@expo/vector-icons";

// const { width, height } = Dimensions.get("window");

// const CategoryItem = ({ category, selectedCategory, onPress }) => {
//   const containerRef = useRef(null);
//   const [containerWidth, setContainerWidth] = useState(0);

//   const onLayout = (e) => {
//     const { width } = e.nativeEvent.layout;
//     setContainerWidth(width);
//   };

//   const isSelected = category.id === selectedCategory?.id;

//   return (
//     <TouchableOpacity
//       style={styles.categoryItem}
//       onLayout={onLayout}
//       onPress={() => onPress(category)}
//     >
//       <View
//         style={[
//           styles.categoryBackground,
//           isSelected && { backgroundColor: "#005F88" },
//         ]}
//       >
//         <Text style={styles.categoryText}>{category.categoryName}</Text>
//       </View>
//       <View
//         style={[styles.itemContainer, { width: containerWidth }]}
//         ref={containerRef}
//       />
//     </TouchableOpacity>
//   );
// };

// const SwiperCategory = ({userData}) => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [foodItems, setFoodItems] = useState([]);
//   const [foodItems2, setFoodItems2] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedFoodItem, setSelectedFoodItem] = useState(null);

//   // console.log(userData.name)

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

//   useEffect(() => {
//     if (categories.length > 0) {
//       setSelectedCategory(categories[0]);
//     }
//   }, [categories]);

//   useEffect(() => {
//     if (selectedCategory) {
//       db.collection("food")
//         .where("foodCategory", "==", selectedCategory.categoryName)
//         .onSnapshot((snapshot) => {
//           const foodData = snapshot.docs
//             .map((doc) => {
//               return {
//                 id: doc.id,
//                 ...doc.data(),
//               };
//             })
//             .sort((a, b) => b.rating - a.rating);
//           setFoodItems(foodData);
//         });
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     if (selectedCategory) {
//       db.collection("food")
//         .where("foodCategory", "==", selectedCategory.categoryName)
//         .onSnapshot((snapshot) => {
//           const foodData2 = snapshot.docs.map((doc) => {
//             return {
//               id: doc.id,
//               ...doc.data(),
//             };
//           });
//           setFoodItems2(foodData2);
//         });
//     }
//   }, [selectedCategory]);

//   const handleCategoryPress = (category) => {
//     setSelectedCategory(category);
//     console.log(`Selected category: ${category.categoryName}`);
//   };

//   const handleFoodCardPress = (foodItems) => {
//     setSelectedFoodItem(foodItems);
//     setModalVisible(true);
//   };

//   const handleLikeItem = async (foodName) => {
//     try {
//       const usersRef = db.collection('users');
//       const querySnapshot = await usersRef.where('name', '==', userData.name).get();
//       if (querySnapshot.empty) {
//         console.log(`User ${userData.name} does not exist.`);
//         return;
//       }
//       const userDoc = querySnapshot.docs[0];
//       const likeItems = userDoc.get('likeItems') || [];
//       if (likeItems.includes(foodName)) {
//         const updatedLikeItems = likeItems.filter(item => item !== foodName);
//         await userDoc.ref.update({ likeItems: updatedLikeItems });
//         console.log(`${foodName} has been removed from the likeItems array.`);
//         const foodQuerySnapshot = await db.collection('food').where('foodName', '==', foodName).get();
//         if (!foodQuerySnapshot.empty) {
//           const foodDoc = foodQuerySnapshot.docs[0];
//           const rating = foodDoc.get('rating') || 0;
//           await foodDoc.ref.update({ rating: rating - 1 });
//           console.log(`Rating of ${foodName} has been decremented.`);
//         }
//       } else {
//         const updatedLikeItems = [...likeItems, foodName];
//         await userDoc.ref.update({ likeItems: updatedLikeItems });
//         console.log(`${foodName} has been added to the likeItems array.`);
//         const foodQuerySnapshot = await db.collection('food').where('foodName', '==', foodName).get();
//         if (!foodQuerySnapshot.empty) {
//           const foodDoc = foodQuerySnapshot.docs[0];
//           const rating = foodDoc.get('rating') || 0;
//           await foodDoc.ref.update({ rating: rating + 1 });
//           console.log(`Rating of ${foodName} has been incremented.`);
//         }
//       }
//     } catch (error) {
//       console.error(`Error adding ${foodName} to the likeItems array:`, error);
//     }
//   };
  
//   const handleFavouriteItem = async (foodName) => {
//     try {
//       const usersRef = db.collection('users');
//       const querySnapshot = await usersRef.where('name', '==', userData.name).get();
//       if (querySnapshot.empty) {
//         console.log(`User ${userData.name} does not exist.`);
//         return;
//       }
//       const userDoc = querySnapshot.docs[0];
//       const favouriteItems = userDoc.get('favouriteItems') || [];
//       if (favouriteItems.includes(foodName)) {
//         const updatedFavouriteItems = favouriteItems.filter(item => item !== foodName);
//         await userDoc.ref.update({ favouriteItems: updatedFavouriteItems });
//         console.log(`${foodName} has been removed from the favouriteItems array.`);
//       } else {
//         const updatedFavouriteItems = [...favouriteItems, foodName];
//         await userDoc.ref.update({ favouriteItems: updatedFavouriteItems });
//         console.log(`${foodName} has been added to the favouriteItems array.`);
//       }
//     } catch (error) {
//       console.error(`Error adding ${foodName} to the favouriteItems array:`, error);
//     }
//   };
  
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.container}>
//         <Text style={styles.headerText}>Category</Text>
//         <View style={styles.swiperContainer}>
//           <FlatList
//             horizontal
//             data={categories}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <CategoryItem
//                 category={item}
//                 selectedCategory={selectedCategory}
//                 onPress={handleCategoryPress}
//               />
//             )}
//             contentContainerStyle={styles.flatlistContainer}
//             showsHorizontalScrollIndicator={false}
//           />
//         </View>
//         <Text style={styles.headerText2}>Popular Now</Text>
//         <FlatList
//           horizontal
//           data={foodItems}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.foodCard}
//               onPress={() => handleFoodCardPress(item)}
//             >
//               <View style={{ flex: 1 }}>
//                 <Image
//                   source={{ uri: item.foodImage }}
//                   style={{ width: 150, height: 150 }}
//                   resizeMode="cover"
//                 />
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text style={styles.foodName}>{item.foodName}</Text>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={styles.foodRating}>
//                     Price: ฿{item.foodPrice}
//                   </Text>
//                 </View>
//                 <Text style={styles.foodDescription}>{item.description}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.foodListContainer}
//           showsHorizontalScrollIndicator={false}
//         />
//         <Text style={styles.headerText2}>Breakfast 07:00 - 09:00</Text>
//         <FlatList
//           horizontal
//           data={foodItems2}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.foodCard}
//               onPress={() => handleFoodCardPress(item)}
//             >
//               <View style={{ flex: 1 }}>
//                 <Image
//                   source={{ uri: item.foodImage }}
//                   style={{ width: 150, height: 150 }}
//                   resizeMode="cover"
//                 />
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text style={styles.foodName}>{item.foodName}</Text>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={styles.foodRating}>
//                     Price: ฿{item.foodPrice}
//                   </Text>
//                 </View>
//                 <Text style={styles.foodDescription}>{item.description}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.foodListContainer}
//           showsHorizontalScrollIndicator={false}
//         />

//         <Text style={styles.headerText2}>Lunch 10:00 - 14:00</Text>
//         <FlatList
//           horizontal
//           data={foodItems2}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.foodCard}
//               onPress={() => handleFoodCardPress(item)}
//             >
//               <View style={{ flex: 1 }}>
//                 <Image
//                   source={{ uri: item.foodImage }}
//                   style={{ width: 150, height: 150 }}
//                   resizeMode="cover"
//                 />
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text style={styles.foodName}>{item.foodName}</Text>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={styles.foodRating}>
//                     Price: ฿{item.foodPrice}
//                   </Text>
//                 </View>
//                 <Text style={styles.foodDescription}>{item.description}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.foodListContainer}
//           showsHorizontalScrollIndicator={false}
//         />

//         <Text style={styles.headerText2}>Dinner 15:00 - 18:00</Text>
//         <FlatList
//           horizontal
//           data={foodItems2}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.foodCard}
//               onPress={() => handleFoodCardPress(item)}
//             >
//               <View style={{ flex: 1 }}>
//                 <Image
//                   source={{ uri: item.foodImage }}
//                   style={{ width: 150, height: 150 }}
//                   resizeMode="cover"
//                 />
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text style={styles.foodName}>{item.foodName}</Text>
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={styles.foodRating}>
//                     Price: ฿{item.foodPrice}
//                   </Text>
//                 </View>
//                 <Text style={styles.foodDescription}>{item.description}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.foodListContainer}
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>{selectedFoodItem?.foodName}</Text>
//             <Image
//               source={{ uri: selectedFoodItem?.foodImage }}
//               style={{ width: 150, height: 150 }}
//             />
//             <Text style={styles.modalText}>
//               Food Category: {selectedFoodItem?.foodCategory}
//             </Text>
//             <Text style={styles.modalDescription}>
//               Description: {selectedFoodItem?.foodDescription}
//             </Text>
//             <Text style={styles.modalText}>
//               Calories: {selectedFoodItem?.foodCalories}
//             </Text>
//             <Text style={styles.modalText}>
//               Price: ฿{selectedFoodItem?.foodPrice}
//             </Text>
//             <Text style={styles.modalText}>
//               {selectedFoodItem?.rating === 0
//                 ? "Be the first to rate it!"
//                 : `"${selectedFoodItem?.rating}" People liked this menu!`}
//             </Text>
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity style={styles.modalButton} onPress={() => handleLikeItem(selectedFoodItem?.foodName)}>
//                 <AntDesign name="heart" size={24} color="black" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.modalButton} onPress={() => handleFavouriteItem(selectedFoodItem?.foodName)}>
//                 <FontAwesome name="star" size={24} color="black" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.modalButtonClose]}
//                 onPress={() => setModalVisible(!modalVisible)}
//               >
//                 <Text style={styles.modalButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 10,
//   },
//   swiperContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   categoryItem: {
//     alignItems: "center",
//     backgroundColor: "#fff",
//     height: height * 0.08,
//     justifyContent: "center",
//     marginHorizontal: width * 0.025,
//     flex: 1,
//   },
//   categoryBackground: {
//     backgroundColor: "#008B9C",
//     borderRadius: 20,
//     padding: 10,
//   },
//   categoryText: {
//     fontSize: 16,
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   headerText: {
//     fontSize: width * 0.06,
//     marginTop: height * 0.025,
//   },
//   headerText2: {
//     fontSize: width * 0.06,
//     marginBottom: height * 0.02,
//   },
//   flatlistContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingHorizontal: width * 0.025,
//     marginTop: height * 0.05,
//   },
//   itemContainer: {
//     height: height * 0.08,
//   },
//   foodCard: {
//     width: 150,
//     height: 200,
//     marginHorizontal: 5,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   foodName: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#005F88",
//     margintop: 5,
//   },
//   foodRating: {
//     fontSize: 12,
//     color: "#808080",
//     marginRight: 5,
//   },
//   foodDescription: {
//     fontSize: 12,
//     color: "#A0A0A0",
//     textAlign: "center",
//   },
//   foodListContainer: {
//     alignItems: "center",
//     paddingHorizontal: 5,
//     paddingVertical: 10,
//   },
//   foodImage: {
//     width: "100%",
//     height: "70%",
//     borderRadius: 10,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalView: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     width: "90%",
//     alignItems: "center",
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     marginTop: 20,
//   },
//   modalButton: {
//     backgroundColor: "#F3F3F3",
//     padding: 10,
//     borderRadius: 10,
//     width: "30%",
//     alignItems: "center",
//   },
//   modalButtonClose: {
//     backgroundColor: "#005F88",
//     width: "30%",
//   },
//   modalButtonText: {
//     color: "#FFF",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default SwiperCategory;
