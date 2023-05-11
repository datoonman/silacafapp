import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { storage, db } from "../firebase";

function TodaysHitCard() {
  const [food, setFood] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const foodRef = db.collection("food");
    const query = foodRef.orderBy("rating", "desc").limit(1);
    query.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const foodData = querySnapshot.docs[0].data();
        setFood(foodData);
        const imageRef = storage.ref('foodImages/Hungry_Emoji_Icon.webp');
        imageRef.getDownloadURL().then((url) => setImageUrl(url)).catch((error) => {
          console.error("Error getting image URL:", error);
        });
      } else {
        console.error("No food found.");
      }
    }).catch((error) => {
      console.error("Error getting food data:", error);
    });
  }, []);

  return (
    <View>
      <Text style={styles.headerText}>Today's Hit</Text>
      {food && (
        <View style={styles.card}>
          <View style={styles.textContainer}>
            <Text style={styles.foodName}>{food.foodName}</Text>
            <Text style={styles.price}>Price {food.foodPrice} ฿</Text>
          </View>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Text style={styles.loadingText}>Loading image...</Text>
          )}
        </View>
      )}
    </View>
  );
}



const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#005F88",
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    marginTop: 0,
    marginHorizontal: width * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    marginLeft: width * 0.02,
    marginTop: 0,
  },
  foodName: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "white",
  },
  price: {
    fontSize: width * 0.04,
    color: "#007AFF",
    color: "white",
  },
});

export default TodaysHitCard;