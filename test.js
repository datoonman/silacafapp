import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "./firebase";

const GenerateReport = ({ navigation }) => {
  const today = new Date();
  const date = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;
  const [mostLikedFood, setMostLikedFood] = useState(null);
  const [mostFavouritedFood, setMostFavouritedFood] = useState(null);
  const [mostDemandedFood, setMostDemandedFood] = useState(null);
  const [mostLikedFoodRating, setMostLikedFoodRating] = useState(null);
  const [mostFavouritedFoodRating, setMostFavouritedFoodRating] =
    useState(null);
  const [mostDemandedFoodRating, setMostDemandedFoodRating] = useState(null);
  const [foodData, setFoodData] = useState([]);
  const [documentCountData, setDocumentCountData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchMostLikedFood = async () => {
      try {
        const snapshot = await db
          .collection("food")
          .orderBy("rating", "desc")
          .limit(1)
          .get();
        const data = snapshot.docs[0].data();
        setMostLikedFood(data.foodName);
        setMostLikedFoodRating(data.rating);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMostFavouritedFood = async () => {
      try {
        const snapshot = await db
          .collection("food")
          .orderBy("favouriteRating", "desc")
          .limit(1)
          .get();
        const data = snapshot.docs[0].data();
        setMostFavouritedFood(data.foodName);
        setMostFavouritedFoodRating(data.favouriteRating);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMostDemandedFood = async () => {
      try {
        const snapshot = await db
          .collection("food")
          .orderBy("demandRating", "desc")
          .limit(1)
          .get();
        const data = snapshot.docs[0].data();
        setMostDemandedFood(data.foodName);
        setMostDemandedFoodRating(data.demandRating);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFoodData = async () => {
      try {
        const snapshot = await db.collection("food").get();
        const data = snapshot.docs.map((doc) => {
          return {
            foodName: doc.data().foodName,
            rating: doc.data().rating,
            favouriteRating: doc.data().favouriteRating,
            demandRating: doc.data().demandRating,
          };
        });
        setFoodData(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDocumentCountData = async () => {
      try {
        const dates = [];
        for (let i = 0; i < 5; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split("T")[0];
          dates.push(formattedDate);
        }

        const snapshot = await db
          .collection("scheduleDate")
          .where("date", "in", dates)
          .get();
        const counts = {};
        snapshot.docs.forEach((doc) => {
          const date = doc.data().date;
          counts[date] = counts[date] ? counts[date] + 1 : 1;
        });
        const data = dates.map((date) => ({
          date,
          count: counts[date] || 0,
        }));
        setDocumentCountData(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFeedbackData = async () => {
      try {
        const snapshot = await db.collection("feedback").orderBy("topic").get();
        const data = snapshot.docs.reduce((acc, doc) => {
          const topic = doc.data().topic;
          if (acc.length === 0 || acc[acc.length - 1].topic !== topic) {
            acc.push({ topic, count: 1 });
          } else {
            acc[acc.length - 1].count++;
          }
          return acc;
        }, []);
        setFeedbackData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMostLikedFood();
    fetchMostFavouritedFood();
    fetchMostDemandedFood();
    fetchFoodData();
    fetchDocumentCountData();
    fetchFeedbackData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Report on {date}</Text>
        <Text style={styles.subheading}>Food Table</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.name]}>Name</Text>
            <Text style={[styles.tableHeader, styles.rating]}>Rating</Text>
            <Text style={[styles.tableHeader, styles.favourite]}>
              Favourite
            </Text>
            <Text style={[styles.tableHeader, styles.demand]}>Demanded</Text>
          </View>
          {foodData.map((food) => (
            <View style={styles.tableRow} key={food.foodName}>
              <Text style={[styles.tableCell, styles.name]}>
                {food.foodName}
              </Text>
              <Text style={[styles.tableCell, styles.rating]}>
                {food.rating}
              </Text>
              <Text style={[styles.tableCell, styles.favourite]}>
                {food.favouriteRating}
              </Text>
              <Text style={[styles.tableCell, styles.demand]}>
                {food.demandRating}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.text}>
          Most Liked Food is {mostLikedFood} {"\n"}
          (Total rating of {mostLikedFoodRating})
        </Text>
        <Text style={styles.text}>
          Most Favourited Food is {mostFavouritedFood} {"\n"}
          (Total rating of {mostFavouritedFoodRating})
        </Text>
        <Text style={styles.subheading}>Demanded Foods & Dates</Text>
        <Text style={styles.text}>
          Most Demanded Food is {mostDemandedFood} {"\n"}
          (Total rating of {mostDemandedFoodRating})
        </Text>
        <Text style={styles.subheading}>Customer Tally</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.name]}>Date</Text>
            <Text style={[styles.tableHeader, styles.rating]}>Count</Text>
          </View>
          {documentCountData.length > 0 ? (
            documentCountData.map(({ date, count }) => (
              <View style={styles.tableRow} key={date}>
                <Text style={[styles.tableCell, styles.name]}>{date}</Text>
                <Text style={[styles.tableCell, styles.rating]}>{count}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No scheduled for the next 5 days</Text>
          )}
        </View>
        <Text style={styles.subheading}>Feedback Report</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.topic]}>Topic</Text>
            <Text style={[styles.tableHeader, styles.count]}>Count</Text>
          </View>
          {feedbackData.map((feedback) => (
            <View style={styles.tableRow} key={feedback.topic}>
              <Text style={[styles.tableCell, styles.topic]}>
                {feedback.topic}
              </Text>
              <Text style={[styles.tableCell, styles.count]}>
                {feedback.count}
              </Text>
            </View>
          ))}
        </View>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
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
  tableContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  name: {
    flex: 2,
  },
  rating: {
    flex: 1,
  },
  favourite: {
    flex: 1,
  },
  demand: {
    flex: 0.5,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 10,
    textAlign: "center",
    flex: 1,
  },
});

export default GenerateReport;
